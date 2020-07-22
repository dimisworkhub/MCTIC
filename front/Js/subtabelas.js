
//variavel usada nas subtabelas:
let listaFinal = [];

//tabela pra previsão de empenho:

function previsaoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/previsaoempenho', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:25%" scope="col">Previsão de Empenho</th>
          <th style="width:40%" scope="col">Natureza da despesa</th>
          <th style="width:10%" scope="col">Tipo</th>
          <th style="width:10%" scope="col">Data</th>
          <th style="width:15%" scope="col">Ano de Referência</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {

          //valorCodigo define se é no html de Lote (1), de Cidades Digitais (2)
          if(valorCodigo=='1'){
            if (meuCodigo == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }
          else if(valorCodigo=='2'){
            if (meuLote == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'previsao'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_previsao_empenho"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["natureza_despesa"];
          tabela += (`</td><td>`);
          if(listaFinal[i]["tipo"]=="o"){
            tabela += "Original";
          }
          else{
            tabela += "Reajuste";
          }
          tabela += (`</td> <td class="data">`);
          let data = listaFinal[i]["data"];
          let dataSeparada = data.split("-");
          let dataEspecial = dataSeparada[2].split("T");

          mascara();

          tabela += dataEspecial[0] + dataSeparada[1] + dataSeparada[0];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["ano_referencia"];
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
}



//tabela pra empenho:

function empenhoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //filtro de subtabelas pelo codigo escolhido (1 para previsao, 2 para lote)
  let caminhoEmpenho;

  if(valorCodigo=='1'){
    caminhoEmpenho = 'read/empenhocodprevisaoempenho/' + meuCodigo;
  }

  //caso não seja em previsão
  else if(valorCodigo=='2' || valorCodigo=='3'){
    caminhoEmpenho = 'read/empenho';
  }

  //função fetch para chamar os itens de empenho da tabela
  fetch(servidor + caminhoEmpenho, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        console.log(json);

        let tabela = "";
        if(valorCodigo=='1'){
          tabela += (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:50%" scope="col">Código de Empenho</th>
          <th style="width:50%" scope="col">Data</th>
          </tr>
          </thead>`);
        }

        //caso não seja em previsão
        else if(valorCodigo=='2' || valorCodigo=='3'){
          tabela += (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:20%" scope="col">Código de Empenho</th>
          <th style="width:40%" scope="col">Natureza de Despesa</th>
          <th style="width:15%" scope="col">Tipo</th>
          <th style="width:25%" scope="col">Data</th>
          </tr>
          </thead>`);
        }
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {

          if(valorCodigo=='1'){
            if (meuCodigo == json[i]["cod_previsao_empenho"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }

          else if(valorCodigo=='2'){
            if (meuCodigo == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }

          else if(valorCodigo=='3'){
            if (meuLote == json[i]["cod_lote"]) {
              listaFinal[j] = json[i];
              j++;
            }
          }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'empenho'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_empenho"];
          tabela += (`</td>`);

          //caso não seja em previsão
          if(valorCodigo=='2' || valorCodigo=='3'){
            tabela += (`<td>`);
            tabela += listaFinal[i]["cod_natureza_despesa"] + " - " + listaFinal[i]["descricao"];
            tabela += (`</td>`);
            tabela += (`<td>`);
            if(listaFinal[i]["tipo"]=="o"){
              tabela += "Original";
            }
            else{
              tabela += "Reajuste";
            }
            tabela += (`</td>`);
          }

          tabela += (`<td class="data">`);
          let data = listaFinal[i]["data"];
          let dataSeparada = data.split("-");
          let dataEspecial = dataSeparada[2].split("T");

          mascara();

          tabela += dataEspecial[0] + dataSeparada[1] + dataSeparada[0];
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      //erros(response.status);
    }
  });
}



//tabela pra fatura:

function faturaSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //filtro de subtabelas pelo codigo escolhido (1 para empenho, 2 para CD)
  let caminhoFatura;

  if(valorCodigo=='1'){
    caminhoFatura = 'read/fatura/' + meuCodigo;
  }

  //caso não seja em empenho
  else if(valorCodigo=='2'){
    caminhoFatura = 'read/fatura';
  }

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + caminhoFatura, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:20%" scope="col">Código de Fatura</th>
          <th style="width:50%" scope="col">Município</th>
          <th style="width:30%" scope="col">Data</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
          listaFinal[j] = json[i];
          j++;
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'fatura'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["num_nf"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["nome_municipio"] + " - " + listaFinal[i]["uf"] + " - " + listaFinal[i]["cod_ibge"];

          tabela += (`</td> <td class="data">`);
          let data = listaFinal[i]["dt_nf"];
          let dataSeparada = data.split("-");
          let dataEspecial = dataSeparada[2].split("T");

          mascara();

          tabela += dataEspecial[0] + dataSeparada[1] + dataSeparada[0];
          tabela += (`</td>`);

          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
}



//tabela pra pagamento:

function pagamentoSub(valorCodigo) {

  document.getElementById("editar").innerHTML = (`<br>`);
  document.getElementById("editar2").innerHTML = (`<br>`);

  //função fetch para chamar os itens de previsão da tabela
  fetch(servidor + 'read/otb', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //console.log(json);

        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:50%" scope="col">Código de Pagamento</th>
          <th style="width:50%" scope="col">Data de Pagamento</th>
          </tr>
          </thead>`);
        tabela += (`<tbody>`);

        let j = 0;
        for (let i = 0; i < json.length; i++) {
        //  if (valorCodigo == json[i]["num_nf"]) {
            listaFinal[j] = json[i];
            j++;
        //  }
        }

        for (i = 0; i < listaFinal.length; i++) {
          //captura itens para tabela
          tabela += (`<tr style="cursor:pointer" id="linha` + i + `" onmouseover="sublinhar(` + i + "," + json.length + `)" onclick="redirecionar(` + i + "," + "'pagamento'" + `)">`);
          tabela += (`<td>`);
          tabela += listaFinal[i]["cod_otb"];
          tabela += (`</td><td>`);
          tabela += listaFinal[i]["dt_pgto"];
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;
      });
    } else {
      erros(response.status);
    }
  });
}



//função necessaria para o funcionamento dos links nas subtabelas
function redirecionar(valor, caminhoFinal){
  if(caminhoFinal == "previsao"){
    localStorage.setItem("cod_previsao_empenho", listaFinal[valor].cod_previsao_empenho);
    localStorage.setItem("cod_lote", listaFinal[valor].cod_lote);
    localStorage.setItem("data", listaFinal[valor].data);
    localStorage.setItem("tipo", listaFinal[valor].tipo);
    localStorage.setItem("ano_referencia", listaFinal[valor].ano_referencia);

    //para mostrar a descrição
    localStorage.setItem("natureza_despesa", listaFinal[valor].natureza_despesa);
    window.location.href = "./gerenciaPrevisao.html";
  }
  else if(caminhoFinal == "empenho"){
    localStorage.setItem("id_empenho", listaFinal[valor].id_empenho);
    localStorage.setItem("cod_empenho", listaFinal[valor].cod_empenho);
    localStorage.setItem("cod_previsao_empenho", listaFinal[valor].cod_previsao_empenho);
    localStorage.setItem("cod_natureza_despesa", listaFinal[valor].cod_natureza_despesa);
    localStorage.setItem("descricao", listaFinal[valor].descricao);
    console.log(listaFinal[valor].descricao);
    localStorage.setItem("tipo", listaFinal[valor].tipo);
    localStorage.setItem("data", listaFinal[valor].data);
    window.location.href = "./gerenciaEmpenho.html";
  }
  else if(caminhoFinal == "fatura"){
    localStorage.setItem("num_nf", listaFinal[valor]["num_nf"]);
    localStorage.setItem("cod_ibge", listaFinal[valor]["cod_ibge"]);
    localStorage.setItem("dt_nf", listaFinal[valor]["dt_nf"]);
    localStorage.setItem("uf", listaFinal[valor]["uf"]);
    localStorage.setItem("nome_municipio", listaFinal[valor]["nome_municipio"]);
    window.location.href = "./gerenciaFatura.html";
    
  }
  else if(caminhoFinal == "pagamento"){
    localStorage.setItem("cod_otb", listaFinal[valor]["cod_otb"]);
    localStorage.setItem("dt_pgto", listaFinal[valor]["dt_pgto"]);
    window.location.href = "./gerenciaPagamento.html";
  }
}

//função decorativa para facilitar a vizualização do link
function sublinhar(valor,tamanho){
  for(i=0;i<tamanho;i++){
    if(i==valor){
      document.getElementById("linha"+i).style.color = "blue";
      document.getElementById("linha"+i).style.textDecoration = "underline";
    }
    else if(document.getElementById("linha"+i).style.color == "blue"){
      document.getElementById("linha"+i).style.color = "black";
      document.getElementById("linha"+i).style.textDecoration = "none";
    }
  }
}


//função comum para os valores em itens:
function splitPreco(preco) {

  //para organizar a mascara
  let preco2,preco3,preco4;

  //console.log(preco.toString().length)

  //Verifica se o númera possui uma casa de milhar
  if((preco.toString()).length > 6){
    preco2 = preco.split(".");
    preco3 = preco2[1].split(",");

    preco4 = (preco2[0] + preco3[0] + preco3[1])/100;
    
    
  }else{
    preco2 = preco.split(",");
    
    preco4 = (preco2[0] + preco2[1])/100;
  }

  return preco4;

}


//lote itens

function itensLote() {

  //cria o botão para editar
  document.getElementById("editar").innerHTML = (`<button id="editar" onclick="editarItemLote()" class="btn btn-success">Salvar Alterações</button>`);
  document.getElementById("editar2").innerHTML = (`<button id="editar" onclick="editarItemLote()" class="btn btn-success">Salvar Alterações</button>`);

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/loteitens', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //tratamento dos erros
    if (response.status == 200) {
      //console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        let j = 0;
        //cria uma lista apenas com os itens do lote selecionado
        for (let i = 0; i < json.length; i++) {
          if (json[i]["cod_lote"] == meuCodigo) {
            listaItem[j] = json[i];
            j++;
          }
        }

        //cria o cabeçalho da tabela
        let tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
                <tr>
                <th style="width:50%" scope="col">Descrição</th>
                <th style="width:50%" scope="col">Valor</th>
                </tr>
                </thead>`);
        tabela += (`<tbody>`);

        for (i = 0; i < listaItem.length; i++) {

          //salva os valores para edição
          meuItem[i] = listaItem[i]["cod_item"];
          meuTipo[i] = listaItem[i]["cod_tipo_item"];

          //captura itens para tabela
          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_item"] + "." + listaItem[i]["cod_tipo_item"] + " - " + listaItem[i]["descricao"];
          tabela += (`</td> <td>`);
          tabela += (`R$ <input value="` + (listaItem[i]["preco"]*100) + `" id="preco` + i + `" type="text" class="preco" size="50">`);
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }
        tabela += (`</tbody>`);
        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();
      });
    } else {
      erros(response.status);
    }
  });
}

function editarItemLote() {

  for (i = 0; i < listaItem.length; i++) {

    //cria json para edição
    //função splitPreco é usada aqui dentro
    edicaoItem[i] = {
      "preco": parseFloat(splitPreco(document.getElementById("preco" + i).value)),
    };

    if (listaItem[i]["preco"] != edicaoItem[i]["preco"]) {
      //transforma as informações em string para mandar
      let corpo = JSON.stringify(edicaoItem[i]);
      //console.log(corpo);
      
      //função fetch para mandar
      fetch(servidor + 'read/loteitens/' + meuCodigo + '/' + meuItem[i] + '/' + meuTipo[i], {
        method: 'PUT',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        //checar o status do pedido
        //console.log(response.statusText);

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}





//Itens de financeamento

let listaItem = [],
  meuItem = [],
  meuTipo = [],
  edicaoItem = [],
  itemMudado = [];

//caso itensfatura seja o selecionado
let meuEmpenho = [];

function itensFinanceamento(caminho) {

  if (caminho == "itensfatura") {
    //cria o botão para editar
    document.getElementById("editar").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button> <button class="btn btn-success" data-toggle="modal" data-target="#adicionarItensFatura">Novo Item Fatura</button>`);
    document.getElementById("editar2").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
  } else {
    //cria o botão para editar
    document.getElementById("editar").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
    document.getElementById("editar2").innerHTML = (`<button class="btn btn-success" onclick="editarItem('` + caminho + `')">Salvar Alterações em Itens</button>`);
  }

  //função fetch para chamar itens da tabela
  fetch(servidor + 'read/' + caminho + "/" + meuCodigo + "/" + meuCodigoSec, {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + meuToken
    },
  }).then(function (response) {

    //checar os status de pedidos
    //console.log(response)

    //tratamento dos erros
    if (response.status == 200) {
      console.log(response.statusText);

      //pegar o json que possui a tabela
      response.json().then(function (json) {

        //testar o json
        //console.log(json);

        let tabela;

        //mudanças feitas para fatura funcionar
        if (caminho == "itensfatura") {
          tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:30%" scope="col">Descrição</th>
          <th style="width:10%" scope="col">Empenho</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('tipo')" scope="col">Tipo</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('quantidade disponível')" scope="col">Quantidade Disponível</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('quantidade')" scope="col">Quantidade</th>
          <th style="cursor:pointer;width:25%" onclick="descricaoItem('valor')" scope="col">Valor</th>
          <th style="cursor:pointer;width:5%" onclick="descricaoItem('subtotal')" scope="col">Subtotal</th>
          </tr>
          </thead>`);
        } else {
          tabela = (`<thead style="background: #4b5366; color:white; font-size:15px">
          <tr>
          <th style="width:50%" scope="col">Descrição</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('quantidade disponível')" scope="col">Quantidade Disponível</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('quantidade')"  scope="col">Quantidade</th>
          <th style="cursor:pointer;width:20%" onclick="descricaoItem('valor')" scope="col">Valor</th>
          <th style="cursor:pointer;width:10%" onclick="descricaoItem('subtotal')" scope="col">Subtotal</th>
          </tr>
          </thead>`);
        }

        //armazenando para edição
        listaItem = json;

        //calculo do total
        let total = 0;
        let totalFinal = 0;

        //criando corpo da tabela
        tabela += (`<tbody>`);

        for (i = 0; i < listaItem.length; i++) {
          //salva os valores para edição
          meuTipo[i] = listaItem[i]["cod_tipo_item"];
          meuItem[i] = listaItem[i]["cod_item"];

          tabela += (`<tr>`);
          tabela += (`<td>`);
          tabela += listaItem[i]["cod_tipo_item"] + '.' + listaItem[i]["cod_item"] + ' - ' + listaItem[i]["descricao"];

          //para fatura
          if (caminho == "itensfatura") {
            tabela += (`</td> <td>`);
            tabela += listaItem[i]["cod_empenho"];
            tabela += (`</td><td>`);
            if(listaItem[i]["tipo"]=="o"){
              tabela += "Original";
            }
            else{
              tabela += "Reajuste";
            }
            meuEmpenho[i] = listaItem[i]["id_empenho"];
          }

          tabela += (`</td> <td>`);
          tabela += listaItem[i]["quantidade_disponivel"];
          tabela += (`</td> <td>`);
          tabela += (`<input value="` + listaItem[i]["quantidade"] + `" id="quantidade` + i + `" type="text" size="10"></input>`);
          tabela += (`</td> <td>`);
          tabela += (`R$ <input value="` + (listaItem[i]["valor"]*100) + `" class="preco" id="valor` + i + `" type="text" size="15"></input>`);
          tabela += (`</td> <td>`);

          //calculo do subtotal
          total = (listaItem[i]["quantidade"] * listaItem[i]["valor"]);
          tabela += total;
          totalFinal = totalFinal + total;
          tabela += (`</td>`);
          tabela += (`</tr>`);
        }

        //a parte final da tabela é organizada de forma diferente.
        tabela += (`<tr>`);
        tabela += (`<td>`);
        tabela += (`<p> Total: </p>`);
        tabela += (`</td>`);

        //espaços
        tabela += (`<td>`);
        tabela += (`</td>`);
        tabela += (`<td>`);
        tabela += (`</td>`);
        tabela += (`<td>`);
        tabela += (`</td>`);

        //espaços extras para fatura
        if (caminho == "itensfatura") {
          tabela += (`<td>`);
          tabela += (`</td>`);
          tabela += (`<td>`);
          tabela += (`</td>`);
        }

        //valor final
        tabela += (`<td>`);
        tabela += totalFinal;
        tabela += (`</td>`);

        tabela += (`</tr>`);
        tabela += (`</tbody>`);

        document.getElementById("tabela").innerHTML = tabela;

        //Máscara colocada separadamente para tabela
        mascara();
      });
    } else {
      erros(response.status);
    }
  });
}

function descricaoItem(valor){
  $("#descricaoItem").modal({
    show: true
  });
  
  descricaoItem2(valor);
}

function descricaoItem2(itemDescrito){
  
  //frase inicial
  document.getElementById("explicacao").innerHTML = "<h2>Calculo para encontrar o valor de " + itemDescrito + ":</h2>";

  //calculos para cada caso
  if(itemDescrito == "subtotal"){
    document.getElementById("calculo").innerHTML = "Quantidade x Valor = " + itemDescrito;
  }else{
    document.getElementById("calculo").innerHTML = "misterio";
  }

}

function editarItem(caminho) {

  for (let i = 0; i < listaItem.length; i++) {

    //função splitPreco é usada aqui dentro
    edicaoItem[i] = {
      "quantidade": parseFloat(document.getElementById("quantidade" + i).value),
      "valor": parseFloat(splitPreco(document.getElementById("valor" + i).value)),
    };

    let caminhoFinal;
    if (caminho == "itensfatura") {
      caminhoFinal = servidor + 'read/' + caminho + '/' + meuCodigo + '/' + meuCodigoSec + '/' + meuEmpenho[i] + '/' + meuItem[i] + '/' + meuTipo[i];
    } else {
      caminhoFinal = servidor + 'read/' + caminho + '/' + meuCodigo + '/' + meuItem[i] + '/' + meuTipo[i];
    }

    if (listaItem[i]["quantidade"] != edicaoItem[i]["quantidade"] || listaItem[i]["valor"] != edicaoItem[i]["valor"]) {
      //transforma as informações do token em json
      let corpo = JSON.stringify(edicaoItem[i]);
      //console.log(corpo);

      //função fetch para mandar
      fetch(caminhoFinal, {
        method: 'PUT',
        body: corpo,
        headers: {
          'Authorization': 'Bearer ' + meuToken
        },
      }).then(function (response) {
        //checar o status do pedido
        //console.log(response.statusText);

        //tratamento dos erros
        if (response.status == 200 || response.status == 201) {
          location.reload();
        } else {
          erros(response.status);
        }
      });
    }
  }
}