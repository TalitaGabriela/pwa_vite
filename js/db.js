import { openDB } from "idb";

let db;

async function createDB() {
  try {
    db = await openDB("banco", 1, {
      upgrade(db, oldVersion, newVersion, transaction) {
        switch (oldVersion) {
          case 0:
          case 1:
            const store = db.createObjectStore("pessoas", {
              // A propriedade nome será o campo chave
              keyPath: "nome",
            });
            // Criando um indice id na store, deve estar contido no objeto do banco.
            store.createIndex("id", "id");
            showResult("Banco de dados criado!");
        }
      },
    });
    showResult("Banco de dados aberto.");
  } catch (e) {
    showResult("Erro ao criar o banco de dados: + e.message");
  }
}

window.addEventListener("DOMContentLoaded", async (event) => {
  createDB();
  document.getElementById("input");
  document.getElementById("btnSalvar").addEventListener("click", addData);
  document.getElementById("btnListar").addEventListener("click", getData);
});

async function addData() {
  const tx = await db.transaction("pessoas", "readwrite");
  const store = tx.objectStore("pessoas");
  store.add({ name: "Fulano" });
  await tx.done;
}

async function getData() {
  if (db == undefined) {
    showResult("O banco de dados está fechado");
    return;
  }
  const tx = await db.transaction("pessoas", "readonly");
  const store = tx.objectStore("pessoas");
  const value = await store.getAll();
  if (value) {
    showResult("Dados do banco: + JSON.stringify(value");
  } else {
    showResult("Não há nenhum dado no banco!");
  }
}

function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
