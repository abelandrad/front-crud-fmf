const apiUrl = 'http://localhost:8080/clientes';

// Fixando o header ao rolar a página
const header = document.querySelector("header");
window.addEventListener("scroll", function() {
  header.classList.toggle("sticky", window.scrollY > 100);
});

// Abrir/fechar o menu
let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
  menu.classList.toggle('bx-x');
  navlist.classList.toggle('open');
};

// Fechar o menu ao rolar a página
window.onscroll = () => {
  menu.classList.remove('bx-x');
  navlist.classList.remove('open');
};

// Manter o formulário visível ao clicar em "Adicionar" e ocultar ao clicar em "Cadastrar"
document.addEventListener('DOMContentLoaded', function() {
  const linkAdicionar = document.getElementById('adicionarLink');
  const formContainer = document.querySelector('.form-container');
  const cadastrarButton = document.querySelector('#cadastroClienteForm button[type="submit"]');

  linkAdicionar.addEventListener('click', function(event) {
    event.preventDefault();
    formContainer.classList.add('active');
  });

  cadastrarButton.addEventListener('click', function(event) {
    event.preventDefault();
    formContainer.classList.remove('active');
  });
});

// Manter o formulário de edição visível ao clicar em "Editar" e ocultar ao clicar em "Salvar"
document.addEventListener('DOMContentLoaded', function() {
  const linkEditar = document.getElementById('editarLink');
  const editarFormContainer = document.querySelector('.form-editar-container');
  const editarButton = document.querySelector('#editarClienteForm button[type="submit"]');

  linkEditar.addEventListener('click', function(event) {
    event.preventDefault();
    editarFormContainer.classList.add('active');
  });

  editarButton.addEventListener('click', function(event) {
    event.preventDefault();
    editarFormContainer.classList.remove('active');
  });
});

// Função para enviar os dados do formulário para a API
async function cadastrarCliente(event) {
  event.preventDefault();

  const form = document.getElementById('cadastroClienteForm');
  const cliente = {
    nome: form.nome.value,
    email: form.email.value,
    etnia: form.etnia.value,
    genero: form.genero.value,
    endereco: {
      cep: form.cep.value
    }
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cliente)
    });

    if (!response.ok) {
      throw new Error('Erro ao cadastrar cliente');
    }

    const data = await response.json();
    console.log('Cliente cadastrado:', data);
    form.reset();
    exibirClientes(); // Atualiza a lista de clientes
  } catch (error) {
    console.error(error);
  }
}

async function exibirClientes() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }
    const data = await response.json();
    const clientesList = document.getElementById('clientesList');
    clientesList.innerHTML = ''; // Limpa a lista de clientes

    data.forEach(cliente => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>${cliente.nome} (${cliente.email})</strong><br>
        Etnia: ${cliente.etnia}<br>
        Gênero: ${cliente.genero}<br>
        CEP: ${cliente.endereco.cep}<br>
      `;
      clientesList.appendChild(listItem);
    });
  } catch (error) {
    console.error(error);
  }
}


const form1 = document.getElementById('cadastroClienteForm');
form.addEventListener('submit', cadastrarCliente);

//Função para exibir Cliente

async function exibirClientes() {
  const clientesBody = document.getElementById('clientesBody');
  clientesBody.innerHTML = '';

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Erro ao buscar clientes');
    }
    const clientes = await response.json();

    clientes.forEach(cliente => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.email}</td>
        <td>${cliente.etnia}</td>
        <td>${cliente.genero}</td>
        <td>${cliente.endereco.cep}</td>
        <td class="actions">
          <button onclick="editarCliente('${cliente.id}')">Editar</button>
          <button onclick="excluirCliente('${cliente.id}')">Excluir</button>
        </td>
      `;
      clientesBody.appendChild(row);
    });
  } catch (error) {
    console.error(error);
  }
}

async function editarCliente(clienteId) {
  
// Redirecionar para a página de edição com o ID do cliente na query string
  window.location.href = `index.html?id=${clienteId}`;
}

async function excluirCliente(clienteId) {
  try {
    const response = await fetch(`${apiUrl}/${clienteId}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir cliente');
    }

    console.log('Cliente excluído');
    exibirClientes();
  } catch (error) {
    console.error(error);
  }
}

// Exibe os clientes cadastrados ao carregar a página
exibirClientes();

async function exibirCliente(clienteId) {
  try {
    const response = await fetch(`${apiUrl}/${clienteId}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar cliente');
    }
    const cliente = await response.json();
    const form = document.getElementById('editarClienteForm');
    form.id.value = cliente.id;
    form.nome.value = cliente.nome;
    form.email.value = cliente.email;
    form.etnia.value = cliente.etnia;
    form.genero.value = cliente.genero;
    form.cep.value = cliente.endereco.cep;
  } catch (error) {
    console.error(error);
  }
}

async function atualizarCliente(event) {
  event.preventDefault();

  const form = document.getElementById('editarClienteForm');
  const clienteId = form.id.value;
  const clienteAtualizado = {
    id: clienteId,
    nome: form.nome.value,
    email: form.email.value,
    etnia: form.etnia.value,
    genero: form.genero.value,
    endereco: {
      cep: form.cep.value
    }
  };

  try {
    const response = await fetch(`${apiUrl}/${clienteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clienteAtualizado)
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar cliente');
    }

    console.log('Cliente atualizado:', clienteAtualizado);
    form.reset();
  } catch (error) {
    console.error(error);
  }
}

const form = document.getElementById('editarClienteForm');
form.addEventListener('submit', atualizarCliente);

// Preenche o formulário com os dados do cliente ao carregar a página
const urlParams = new URLSearchParams(window.location.search);
const clienteId = urlParams.get('id');
if (clienteId !== null) {
  exibirCliente(clienteId);
} else {
  console.error('ID do cliente não fornecido');
}
