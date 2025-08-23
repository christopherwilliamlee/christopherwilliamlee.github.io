---
layout: guia
title: Guia completo para um sistema de gerenciamento de dados e amostras para laboratório em Google planilhas
permalink: /guias/meus_projetos/google_sheets/
---

![Google Sheets](/assets/img/google_sheets/google_logo.png)


# Planilha automatizada para controle de dados

Fala pessoal! Decidi trazer um dos meus projetos que mais utilizo e que fez uma diferença na pesquisa do meu doutorado que vocês não têm noção. Tá... eu confesso. Eu tinha um preeeconceitooo com o google planilhas antes de trabalhar no Genomas Paraná. Antes de migrar para o google planilhas, eu trabalhava apenas com Excel. Hoje eu vejo a diferença entre um e outro. Cada um com as suas características, mas foi um caminho sem volta. Graças a minha amiga Monica que também está envolvida nessa pesquisa, foi um passo que dei na minha vida e que mudou por completo. Muito obrigado, Monica por insistir!!! 🫶🫶🫶<br>
Por que eu digo que isso foi um divisor de águas na minha vida? Porque a partir disso, eu comecei a trabalhar em outros projetos que me renderam um dinheirinho extra mensal. Fiz planilhas para empresas com mais de 400 funcionários assim como empresas de pequeno porte com apenas 3 funcionários, mas com um grande volume de vendas. Tá.. tá... eu sei. As planilhas têm as suas limitações! Mas usem quando puderem e saibam das suas limitações!

<img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGNnbWt0bG5rNnQyZTNtbHg1MzByNGFxeTh4eHhuMjBtcjIzcTR0YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/TncmRRvEGVoVcHgaAb/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

> May the sheets be with you!

# O que é o Google Sheets?

O Google Sheets é a planilha online do Google, que funciona direto no navegador e salva tudo na nuvem.

Ele é colaborativo, ou seja, várias pessoas podem editar e acompanhar os dados ao mesmo tempo. Além disso, dá pra usar fórmulas, gráficos, automações e até scripts avançados.

Em resumo: é uma ferramenta leve, gratuita e super versátil — perfeita pra quem quer organizar informações, trabalhar em equipe e ainda ter acesso de qualquer lugar.

## Passo a passo
1. [Explicação sobre as planilhas](#explicacao)
2. [Baixando uma cópia](#copia)
3. [Planilha de cadastros](#cadastros)
4. [Planilha de trabalhos](#trabalhos)
5. [Planilha de intermediação](#intermediacao)
6. [Planilha de impressão de tubos](#tubos)


<h1 id="explicacao">1. Explicação sobre as planilhas</h1>


Pra quem já trabalha com excel ou google planilhas, vai pegar rápido o jeito de trabalhar. Para quem tem dificuldades com planilhas ainda, sugiro que assita uma aula sobre google planilhas básico para que não se bata tanto para trabalhar com elas. Aproveite que a planilha está de graça e que você pode fazer cópias à vontade para treinar também!

O sistema é dividido em 4 partes: Planilha de cadastros, trabalhos, intermediação e impressão de tubos.

<h1 id="copia">2. Fazendo uma cópia das planilhas</h1>

![G1](/assets/img/google_sheets/g_1.png)
Para fazer uma cópia das suas planilhas basta clicar em arquivo e depois clicar em Fazer uma cópia. Ao clicar em Fazer uma cópia, uma nova janela será aberta. 

![G2](/assets/img/google_sheets/g_2.png)

Nessa janela você pode mudar o nome da planilha para qualquer nome que você queira, salvar em qualquer pasta no drive que você quiser e clicar em fazer cópia... pronto! Ela está pronta para ser usada. 

<h1 id="cadastros">3. Planilha de cadastros</h1>

![G3](/assets/img/google_sheets/g_3.png)
A planilha de cadastros que eu montei possui algumas informações básicas e necessárias para cadastros de pessoas, como: ID,	Nome, CPF, Sexo, Data de nascimento, Endereço, Bairro, Telefone, Celular, EMAIL, Contato próximo, Fone, contato próximo e Status do participante.

> Antes que venham falar: 'Olhaaa você está usando dados e está expondo eles!!!!' 
>> Os dados são fictícios!!!!!

O principal e o mais importante é o ID. É através dele que a gente vai localizar o cadastro do indivíduo. Não necessariamente a gente vai usar ele como <a href="https://pt.wikipedia.org/wiki/Chave_prim%C3%A1ria" target="_blank">chave primária (PK)</a>, coisa que poderia ser usado, mas em outras ocasiões, não agora.

O status do participante traz algumas informações valiosas com relação ao status do material biológico do indivíduo. Esses status são: **<span style="color:#f4cccc">Aguardando Coleta</span>, <span style="color:#ffe599">Parcialmente Processado</span> e <span style="color:#b7e1cd">Material Coletado</span>**. Essas informações vêm da <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">Planilha de trabalho - processamento_qualidade</a>. O restante são dados que são preenchidos normalmente conforme o cadastro do indivíduo.


<h1 id="trabalhos">4. Planilha de trabalhos</h1>

![G4](/assets/img/google_sheets/g_4.png)
Agora vamos destrinchar a <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">planilha de trabalho</a>.

A <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">planilha de trabalho</a> funciona da seguinte forma.
Ela possui as seguintes informações: **ID, Status do participante, NOME, SEXO, CPF, NASCIMENTO, ENDEREÇO, BAIRRO	TEL, CEL, KIT LABORATORIAL.** Ela também é formada por algumas abas **participantes, triagem, processamento_qualidade, armazenamento e controle.**


A aba participantes possui as informações de ID, NOME, CPF e todo o restante que estão relacionados ao cadastro do participante vem da <a href="https://docs.google.com/spreadsheets/d/1zg4SAq8APtGb8hDer0VHNIu_QlLJTWrr5TfyJuO6AKM" target="_blank">planilha de cadastros</a> de forma automática. Ou seja, você não precisa preencher nada! 

Os dados de Status do material vem da <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">planilha de trabalho</a> da aba STATUS DO MATERIAL e o KIT LAB é algo que você mesmo tem que alterar conforme o kit ser entregue ou não. O KIT LAB é um dropdown list e possui dois status: Aguardando entrega e Entregue. O próprio status já diz, né? Aguardando entrega, quer dizer que o kit está montado, mas não foi entregue ainda e Entregue quer dizer que o kit já foi entregue para o responsável fazer a coleta.

## Aba Triagem

![G5](/assets/img/google_sheets/g_5.png)

A aba triagem possui as informações: **ID, TUBO ROXO, TUBO AMARELO, Coletor de saliva, FRASCO FEZES, T °C	RECEBIDO, EM OBSERVAÇÃO.**

O ID, como a gente sabe, é o que identifica o indivíduo. Digamos que aqui sim ele funciona como <a href="https://pt.wikipedia.org/wiki/Chave_prim%C3%A1ria" target="_blank">chave primária</a>.

Tubo roxo faz referência ao plasma coletado, o tubo amarelo ao soro, a saliva e frascos de fezes ao próprio indivíduo. Note que as cores dos status muda conforme o que é preenchido. Por exemplo, Coletado aparece em verde, Falta material em laranja e Material inadequado como vermelho. A pessoa que irá cadastrar precisará colocar qualquer uma das colunas para indicar o que já foi feito durante a coleta do material biológico.

A temperatura possui uma fórmula e preenche de forma automática indicando que os materiais vieram a 8 °C (foi o que pediram pra por na época). Recebido em é preenchido também de forma manual, então a pessoa que recebeu esses materiais precisa especificar a data que o material biológico foi coletado e a observação caso haja a necessidade de colocar qualquer observação.


## Aba Processamento e qualidade

![G6](/assets/img/google_sheets/g_6.png)
É aqui que a coisa começa a ficar legal. Na verdade, essa aba foi feita para registrar os resultados de quantificação e qualidade do DNA e RNA. Então, note, essa aba possui as colunas com os nomes: ID, Concentração (ng), 260/280, 260/230. ID faz referência ao ID do participante, concentração é o resultado da quantificação do DNA ou RNA e os parâmetros de absorbância 280 e 230 estão relacionados à análise qualitativa da amostra. Em cima dos nomes das colunas, você tem as regras. Essas regras são condicionais que são aplicadas com fórmulas de maneira automatizada. Ou seja, se você tiver um resultado de absorbância de > 1,6, então aparecerá um fundo verde claro com as letras verde escura; se você tiver um resultado < 1,59, então os resultados colocados nas colunas aparecerão com fundo vermelho claro e letras vermelho escura; e o mesmo vale para os parâmetros de concentração > 20, < 19,9.

A última coluna que é o timestamp é o registro que é feito na hora da primeira inserção do resultado no primeiro registro da quantificação do DNA, célula B7, por exemplo.

<pre>=IFS(B7="";"";N7<>"";N7;1*1;AGORA())</pre>

## Aba armazenamento

![G7](/assets/img/google_sheets/g_7.png)
Essa aba é bastante simples, ela tem a informação do ID do indivíduo, as especificações se é DNA, RNA, Saliva e etc... Ela é toda preenchida de forma automatizada. Nela temos dois exemplos de fórmula.

<pre>=SE(A5="";"";SE(processamento_qualidade!$D7<>""; "Armazenado"; "Aguardando"))</pre>

Condicionais que indicam que se A5 estiver vazia, então não fazer nada, caso contrário vai aparecer como Armazenado. Ela também pega informações da aba processamento_qualidade. Caso a célula da aba processamento_qualidade estiver vazia, então vai mostrar como Aguardando, caso contrário, vai mostrar como Armazenado.

<pre>=SE(I5="Armazenado"; "Armazenado"; "Aguardando")</pre>

Essa fórmula indica que se a célula I5 estiver como Armazenado, então a célula atual vai estar também como Armazenado, caso contrário fica como Aguardando. Lembrando que essas fórmulas forma projetadas para o atual projeto de pesquisa e elas podem ser modificadas conforme a necessidade.

## Aba controle

![G8](/assets/img/google_sheets/g_8.png)
A aba controle é bem simples e consiste em algumas colunas como: Aba, Destinatário, PDF, Envio, Data e hora.

A coluna Aba, é a informação da aba que você deseja enviar para algum e-mail. Por exemplo, se você quiser enviar todas as informações da aba triagem, você deve colocar triagem na aba.

A coluna Destinatário vai o e-mail do destinatário; PDF e Envio são preenchidos automaticamente caso haja sucesso no envio do pdf para o destinatário e Data e hora é o timestamp em si.

<h1 id="intermediacao">5. Planilha de intermediação</h1>

![G9](/assets/img/google_sheets/g_9.png)
Ufa, estamos perto do fim! Essa é a penúltima planilha. Digamos que essa é a planilha que vai ser usada pela recepção. Ela vai fazer o contato com o indivíduo para fazer o agendamento da coleta. Essa planilha contem algumas informações essenciais para o contato direto com o indivíduo. A única diferença vão ser as últimas 3 colunas: Obs. da coleta, Status da amostra e Status.

A coluna de Status da amostra puxa dados de forma automática da <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">planilha de trabalho</a>. As únicas colunas que a pessoa deverá mexer são Obs. da coleta e Status. A observação da coleta deverá ser preenchida conforme a necessidade da pessoa e a coluna Status possui um menu dropdown que contem as seguintes informações: Faleceu, Desistiu, Não atende, Sem contato, Sem disponibilidade, Aguardando, Agendado, Parcialmente e coletado. Todos eles deverão ser selecionados conforme o contato com o indivíduo. A única diferença aqui será com relação ao Status Agendado. 


## Aba agendados

![G10](/assets/img/google_sheets/g_10.png)
Ao selecionar Agendado, a aba Agendados irá coletar a informação do ID do indivíduo, data agendada, número da amostra (Coluna D e H) e as colunas I a Q irão coletar as informações da planilha de trabalho - armazenamento para pegar as informações dos códigos dos tubos das amostras. Isso é muito útil para quem trabalha com aquelas máquinas de imprimir tubo como a do exemplo abaixo.

![Impressora de tubos](/assets/img/google_sheets/tubo_imp.png)

<h1 id="tubos">6. Planilha de impressão de tubos</h1>
Essa é a última planilha! Essa planilha é importante para quem quer ter uma ideia de como estruturar uma planilha para a impressão de tubos ou tem um equipamento de impressão de tubos igual ao exemplo de cima. 

## aba agendados

![G11](/assets/img/google_sheets/g_11.png)
Na aba agendados, você tem algumas informações básicas indo da coluna A a I que trazem as informações da <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">planilha de trabalho</a> da aba Armazenamento que são os códigos referentes aos tubos de coleta que estão armazenados. A coluna J trará a informação da <a href="https://docs.google.com/spreadsheets/d/1rI9qSLrxRDZBFQgidE_4CbiluVz1iSJFRF4o5sBlwYU" target="_blank">planilha de intermedicação</a> da aba agendados. Note que essa coluna (J), trará informação apenas dos tubos que são coletadas na data do dia, ou seja, como se fosse "hoje".

## aba não agendados

![G12](/assets/img/google_sheets/g_12.png)
A aba não agendados funciona basicamente da mesma forma. A única coisa qeu você vai ter que acrescentar como informação é na coluna J (ID) que irá trazer de forma automática os códigos referentes aos tubos de coleta.

---
<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExenRwejZyaHpjOHNpOGxra2R0NW1pODB5OHhxenZncXR2cHM2ZjIweCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/dBTGeHJ3aIvtJDe4VV/giphy.gif" alt="gif" width="200">

sim sim, eu sei... É muita coisa pra aprender em um lugar só. Respire fundo e mantenha a calma! Você vai se acostumando aos poucos, vai se familiarizando e vai pegando o jeito da coisa. Se precisarem de qualquer coisa, entrem em contato.

Até a próxima!! Ahhh, se quiserem deixar também uma pequena caridade em pix ou Bitcoin fiquem à vontade, tá? Ficarei muito grato e com muito mais vontade de postar coisas aqui.

Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)
![Dog meme](/assets/img/meme/hq720.jpg)

# Referências:

1. <a href="https://docs.google.com/spreadsheets/d/1zg4SAq8APtGb8hDer0VHNIu_QlLJTWrr5TfyJuO6AKM" target="_blank">Planilha de cadastro</a>
2. <a href="https://docs.google.com/spreadsheets/d/1W0gjIZneEWdQT-5qUysEhDE1NUAIRCL3ocHLmYVBGmc" target="_blank">Planilha de trabalho</a>
3. <a href="https://docs.google.com/spreadsheets/d/1rI9qSLrxRDZBFQgidE_4CbiluVz1iSJFRF4o5sBlwYU" target="_blank">Planilha de intermediação</a>
4. <a href="https://docs.google.com/spreadsheets/d/1mLBU_gLnAlXYlh-WTn0TqFD9AzPBYJhtsq4G6SMFOt0" target="_blank">Planilha de impressão de tubos</a>