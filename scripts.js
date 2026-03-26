// Substitua SEU_ENDPOINT_AQUI por um endpoint gerado no CrudCrud
const API_URL = "https://crudcrud.com/api/SEU_ENDPOINT_AQUI/clientes";
const form = document.getElementById("form-cliente");
const lista = document.getElementById("lista-clientes");
const mensagem = document.getElementById("mensagem");
const botao = document.getElementById("btn-submit");

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.style.color = erro ? "red" : "green";
}

// LISTAR CLIENTES
async function listarClientes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Erro ao buscar clientes");

    const data = await res.json();

    lista.innerHTML = "";

    data.forEach(cliente => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${cliente.nome} - ${cliente.email}
        <button onclick="deletarCliente('${cliente._id}')">Excluir</button>
      `;
      lista.appendChild(li);
    });
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao carregar clientes", true);
  }
}

// CADASTRAR CLIENTE
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!nome || !email) {
    mostrarMensagem("Preencha todos os campos", true);
    return;
  }

  botao.disabled = true;
  mostrarMensagem("Enviando...");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email })
    });

    if (!res.ok) throw new Error("Erro ao cadastrar");

    form.reset();
    mostrarMensagem("Cliente cadastrado com sucesso");
    listarClientes();
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao cadastrar cliente", true);
  } finally {
    botao.disabled = false;
  }
});

// DELETAR CLIENTE
async function deletarCliente(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("Erro ao deletar");

    mostrarMensagem("Cliente removido");
    listarClientes();
  } catch (error) {
    console.error(error);
    mostrarMensagem("Erro ao remover cliente", true);
  }
}

// INICIAR
listarClientes();
