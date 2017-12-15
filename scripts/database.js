window.indexedDB = window.indexedDB ||
                    window.mozIndexedDb ||
                    window.webkitIndexedDb ||
                    window.msIndexedDb;

var request, db;

if (!window.indexedDB) {
    window.alert("Seu navegador não suporta o recurso IndexedDb.");
} else {
    request = window.indexedDB.open("DBCandidatos", 1);

    request.onerror = function (event) {
        $("#mensagemdb").addClass("erro_db");
        $("#mensagemdb").html("Erro ao abrir banco de dados");
        $("#enviarRegistro").prop("disabled", true);
    };

    request.onsuccess = function (event) {
        $("#mensagemdb").addClass("sucesso_db");
        $("#mensagemdb").html("Banco de dados aberto com sucesso");
        db = event.target.result;
    };

    request.onupgradeneeded = function (event) {
        $("#mensagemdb").addClass("sucesso_db");
        $("#mensagemdb").html("Banco de dados preparado para uso");
        db = event.target.result;

        var objectStore = db.createObjectStore(
            "candidatos", { keyPath: "email" });
    };

    //evento para incluir um candidato
    $("#enviarRegistro").click(function () {
        var nome = $("#nome").val();
        var datanasc = $("#data").val();
        var sexo;
        if ($("#masculino").is(":checked")) {
            sexo = "masculino";
        } else {
            sexo = "feminino";
        }
        var telefone = $("#telefone").val();
        var email = $("#email").val();
        var vaga = $("#vaga").val();

        var transaction = db.transaction(["candidatos"], "readwrite");

        transaction.oncomplete = function (event) {
            $("#mensagemdb").html("Registro inserido!");
            //$(location).attr("href", "/paginas/registroOk.html");
        };

        transaction.onerror = function (event) {
            alert("Ocorreu um erro ao incluir registro");
        };

        //código para incluir um novo registro
        var objectStore = transaction.objectStore("candidatos");
        objectStore.add({
            email: email,
            nome: nome,
            data: datanasc,
            sexo: sexo,
            telefone: telefone,
            vaga: vaga
        });
    });

    //evento para listar os candidatos
    $("#btnListar").click(function () {
        var request = db.transaction(["candidatos"], "readonly")
            .objectStore("candidatos");

        request.openCursor().onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                $("#listaCandidatos").append("<li>"
                    + cursor.value.nome + "</li>");
                cursor.continue();
            }
        };

    });
}