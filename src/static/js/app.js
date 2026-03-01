const root = document.getElementById('root');

const state = {
  items: [],
  isLoading: true,
  isSubmitting: false,
  error: '',
};

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload.error || 'Request failed.';
    throw new Error(message);
  }

  return payload;
}

function render() {
  const itemsMarkup = state.items
    .map(
      (item) => `
        <div class="item ${item.completed ? 'completed' : ''}">
          <button type="button" class="btn btn-link p-0 toggles" data-action="toggle" data-id="${item.id}" aria-label="${item.completed ? 'Mark item as incomplete' : 'Mark item as complete'}">
            <i class="far ${item.completed ? 'fa-check-square' : 'fa-square'}"></i>
          </button>
          <span class="name">${escapeHtml(item.name)}</span>
          <button type="button" class="btn btn-link p-0 text-danger" data-action="delete" data-id="${item.id}" aria-label="Remove item">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      `,
    )
    .join('');

  root.innerHTML = `
    <div class="container app-shell">
      <div class="row justify-content-center">
        <div class="col-lg-7 col-md-9">
          <h1 class="h3 mb-4 text-center">Todo App</h1>

          <form id="add-form" class="mb-3">
            <div class="input-group">
              <input id="item-name" class="form-control" type="text" placeholder="Add a new task" maxlength="255" />
              <button class="btn btn-success" type="submit" ${state.isSubmitting ? 'disabled' : ''}>
                ${state.isSubmitting ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>

          ${state.error ? `<div class="alert alert-danger py-2" role="alert">${escapeHtml(state.error)}</div>` : ''}

          ${
            state.isLoading
              ? '<p class="text-center text-muted">Loading…</p>'
              : state.items.length === 0
                ? '<p class="text-center text-muted">No todo items yet. Add one above.</p>'
                : `<div id="item-list">${itemsMarkup}</div>`
          }
        </div>
      </div>
    </div>
  `;

  wireEvents();
}

function wireEvents() {
  const addForm = document.getElementById('add-form');
  const nameInput = document.getElementById('item-name');

  if (addForm && nameInput) {
    addForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = nameInput.value.trim();
      if (!name || state.isSubmitting) {
        return;
      }

      state.error = '';
      state.isSubmitting = true;
      render();

      try {
        const item = await request('/items', {
          method: 'POST',
          body: JSON.stringify({ name }),
        });
        state.items = [item, ...state.items];
        state.isSubmitting = false;
        render();
      } catch (error) {
        state.isSubmitting = false;
        state.error = error.message;
        render();
      }
    });
  }

  root.querySelectorAll('[data-action="toggle"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');
      const existingItem = state.items.find((item) => item.id === id);
      if (!existingItem) {
        return;
      }

      state.error = '';

      try {
        const updatedItem = await request(`/items/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            name: existingItem.name,
            completed: !existingItem.completed,
          }),
        });

        state.items = state.items.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        );
        render();
      } catch (error) {
        state.error = error.message;
        render();
      }
    });
  });

  root.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.getAttribute('data-id');

      state.error = '';

      try {
        await request(`/items/${id}`, { method: 'DELETE' });
        state.items = state.items.filter((item) => item.id !== id);
        render();
      } catch (error) {
        state.error = error.message;
        render();
      }
    });
  });
}

async function bootstrap() {
  render();

  try {
    state.items = await request('/items');
    state.isLoading = false;
    state.error = '';
    render();
  } catch (error) {
    state.isLoading = false;
    state.error = error.message;
    render();
  }
}

bootstrap();
