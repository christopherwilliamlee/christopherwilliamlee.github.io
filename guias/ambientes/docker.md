---
layout: guia
title: Tutorial de instalação do Docker
permalink: /guias/ambientes/docker/
---

![Docker logo](/assets/img/docker/docker_logo.png)

# <u>Instalação do Docker + primeiro container (FastQC)</u>

<p style="text-align: justify">
  Fala, galera! Bora colocar o <a class="badge badge--docker" href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> pra rodar no WSL? <br> 
  Quem nunca sofreu com o famoso "na minha máquina funciona"? Pois é... containers resolvem isso com
  <span class="tooltip">isolamento
    <span class="tooltiptext">Cada app roda em um ambiente fechado, sem atrapalhar o restante do sistema.</span>
  </span>,
  <span class="tooltip">reprodutibilidade
    <span class="tooltiptext">Você consegue recriar exatamente o mesmo ambiente em qualquer lugar.</span>
  </span> e
  <span class="tooltip">portabilidade
    <span class="tooltiptext">O mesmo container roda no seu notebook, em servidores ou na nuvem sem ajustes.</span>
  </span>.
  No fim das contas, o <span class="badge badge--docker">Docker</span> é como uma caixa fechada onde você coloca seu software e garante que vai rodar sempre do mesmo jeito.
</p>

Neste guia, <u>você vai</u>:

- Entender o que é um container;
- Criar **seu primeiro container** usando o <a href="/guias/qualidade/fastqc/">**FastQC**</a> como exemplo.

<img src="https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3b21zZjJ4djkyenVsZGpnbGwwa2d2NXhtcHd0YXZsNTI2ZWUyZ3UzbiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/jU5TRRcqzeLgS5oCNm/giphy.gif" alt="gif" width="260" style="display:block; margin:auto;">

<p style="text-align: justify">
<strong>Imagina um porto</strong>: cada navio carrega containers fechados com tudo o que precisam dentro.  
O <span class="badge badge--docker">Docker</span> funciona assim: você empacota o software em um container e ele chega intacto em qualquer lugar.
</p>

<p>Quer aprender mais sobre <span class="badge badge--docker">Docker</span> acesse o meu medium para <a href="medium.com/#" target="_blank">aprender mais</a>?</p>
---

# O que é o Docker?

<p>
  O <a class="badge badge--docker" href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> é como um
  <span class="tooltip">sistema de containers
    <span class="tooltiptext">Caixas padronizadas que carregam aplicativos e todas as suas dependências.</span>
  </span>
  que transporta seu software sem dor de cabeça.
</p>

<ul>
  <li>
    Você usa uma 
    <span class="tooltip"><strong>imagem</strong>
      <span class="tooltiptext">
        Pacote pronto: mini sistema + dependências + programa.
        É um molde que não muda e serve para criar containers iguais.
      </span>
    </span>:
    um molde pronto com sistema, bibliotecas e programa configurados.
  </li>

  <li>
    Quando a imagem “zarpa”, ela vira um container: um navio ativo navegando isolado do resto do sistema.
  </li>

  <li>
    É possível rodar 
    <span class="tooltip"><strong>vários containers</strong>
      <span class="tooltiptext">
        Cada um tem seus próprios processos e arquivos.
        Podem usar a mesma imagem sem “brigar” entre si.
      </span>
    </span>
    ao mesmo tempo, como uma frota organizada, sem conflitos.
  </li>

  <li>
    O mesmo container pode 
    <span class="tooltip"><strong>“atracar” em qualquer porto</strong>
      <span class="tooltiptext">
        A mesma imagem roda do mesmo jeito em notebook, WSL, servidor ou nuvem,
        desde que tenha Docker instalado.
      </span>
    </span>:
    seu notebook, WSL, servidor ou nuvem.
  </li>

  <li>
    Resultado: softwares 
    <span class="tooltip"><strong>reprodutíveis</strong>
      <span class="tooltiptext">Mesma versão do app e das dependências, sempre.</span>
    </span>, 
    <span class="tooltip"><strong>portáteis</strong>
      <span class="tooltiptext">Você “puxa” a imagem (ex.: Docker Hub) e roda em outra máquina.</span>
    </span> 
    e 
    <span class="tooltip"><strong>fáceis de compartilhar</strong>
      <span class="tooltiptext">Publique com uma tag de versão e qualquer pessoa obtém igualzinho.</span>
    </span>.
  </li>
</ul>

---

## Passo a passo
1. [Instalando o Docker](#instalacao)
2. [Seu primeiro container (FastQC)](#container)
3. [Criando sua própria imagem](#imagem)

---
<h2 id="instalacao">1. Instalando o Docker</h2>

<p>
  Para usar o <span class="badge badge--docker">Docker</span>, você precisa do 
  <span class="tooltip"><strong>engine</strong>
    <span class="tooltiptext">Serviço que cria e executa containers. É o “motor” do Docker.</span>
  </span> rodando no sistema. No WSL/Ubuntu a instalação é direta.
</p>

<blockquote class="info">
  Se você já tem o <span class="badge badge--docker">Docker</span>, pode pular a instalação. Verifique com:
  <pre>docker --version</pre>
  <blockquote class="tip">Dica: recomendo <strong>Ubuntu 20.04 LTS ou superior</strong> (idealmente 22.04 LTS). Confira sua versão com:
  <pre>lsb_release -a</pre>
  </blockquote>
</blockquote>

<h3>1.1 Instalando o Docker (WSL/Ubuntu)</h3>

<pre>sudo apt update
sudo apt install -y docker.io</pre>

<p>Verifique se o serviço está ativo:</p>
<pre>sudo systemctl status docker</pre>

<p>Saída esperada (algo como):</p>
![Docker 1](/assets/img/docker/docker_1.png)

<blockquote class="info">
  <strong>WSL e systemctl:</strong> se esse comando não funcionar, tente:
  <br><code class="codeStyle">sudo service docker status</code>.
  Em algumas instalações do WSL é preciso habilitar o <code class="codeStyle">systemd</code> em <code class="codeStyle">/etc/wsl.conf</code> e reiniciar o WSL (<code class="codeStyle">wsl.exe --shutdown</code>).
</blockquote>

<p>Saída esperada (algo como):</p>
![Docker 2](/assets/img/docker/docker_2.png)

<h3>1.2 Pós-instalação e teste</h3>

<p>Permita usar o <span class="badge badge--docker">Docker</span> sem <code class="codeStyle">sudo</code>:</p>
<pre>sudo usermod -aG docker $USER
newgrp docker</pre>

<blockquote class="tip">
  <strong>Grupo docker:</strong> o <code class="codeStyle">newgrp docker</code> aplica a permissão na sessão atual.
  Para persistir, feche e reabra o terminal (ou rode <code class="codeStyle">wsl.exe --shutdown</code> e abra o WSL de novo).
</blockquote>

<p>Teste a instalação:</p>
<pre>docker --version</pre>

<p>Saída esperada (algo como):</p>
<code style="display:inline-block; background:#2d2d2d; color:#e1e1e1; border-radius:6px; padding:8px 12px; white-space:pre; line-height:1.4;">Docker version 24.0.x, build XXXXXXX
</code>

<blockquote class="info">
  <strong>Teste rápido do engine:</strong>
  <pre>docker run --rm hello-world</pre>
  <small>Se aparecer a mensagem de boas-vindas, o engine está OK.</small>
</blockquote>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Comando</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code class="codeStyle">sudo apt update</code></td>
        <td>Atualiza a lista de pacotes do Ubuntu.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">sudo apt install -y docker.io</code></td>
        <td>Instala o <span class="badge badge--docker">Docker</span> Engine do repositório do Ubuntu.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">sudo systemctl status docker</code></td>
        <td>Verifica se o serviço do <span class="badge badge--docker">Docker</span> está em execução.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">sudo usermod -aG docker $USER</code></td>
        <td>Adiciona seu usuário ao grupo <code class="codeStyle">docker</code> (rodar sem <code class="codeStyle">sudo</code>).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">newgrp docker</code></td>
        <td>Aplica a nova permissão na sessão atual.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">docker --version</code></td>
        <td>Exibe a versão instalada do <span class="badge badge--docker">Docker</span>.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">docker run --rm hello-world</code></td>
        <td>Valida o funcionamento do engine executando um container de teste.</td>
      </tr>
    </tbody>
  </table>
</div>

<blockquote class="tip">
  <strong>Quero a versão oficial mais recente:</strong><br>
  <code class="codeStyle">curl -fsSL https://get.docker.com | sh</code><br>
  (instala a versão estável diretamente da <span class="badge badge--docker">Docker</span>)
  <blockquote class="warning">
  <strong>Segurança:</strong> <code class="codeStyle">curl | sh</code> executa um script da internet.
  Use apenas se confiar na fonte; quando possível, prefira os pacotes do Ubuntu.
  </blockquote>
</blockquote>

---

<h2 id="container">2. Seu primeiro container (FastQC)</h2>

<p>
  Agora que o <span class="badge badge--docker">Docker</span> está instalado, é hora de colocar um container para navegar.
  Vamos usar o <a href="https://www.bioinformatics.babraham.ac.uk/projects/fastqc/" target="_blank">
    <span class="tooltip"><strong>FastQC</strong>
      <span class="tooltiptext">Ferramenta popular para checar a qualidade de arquivos FASTQ.</span>
    </span>
  </a> como exemplo.
</p>

<h3>2.1 Baixando a imagem</h3>

<p>
  No <span class="badge badge--docker">Docker</span>, tudo começa com uma <span class="tooltip"><strong>imagem</strong>
    <span class="tooltiptext">Pacote que contém o programa e suas dependências.</span>
  </span>.  
  Para o FastQC, existe uma imagem no <a href="https://hub.docker.com/r/biocontainers/fastqc/tags" target="_blank">Docker Hub</a>.  
  <p>
    Atenção: esse repositório não tem a tag
    <span class="tooltip"><code class="codeStyle">latest</code>
      <span class="tooltiptext">Tag padrão que o Docker usa quando nenhuma versão é informada (equivale a <code>:latest</code>). Muitos projetos não publicam <code>latest</code> para forçar que você escolha uma versão específica/estável.</span>
    </span>,
    então é preciso especificar a versão.
  </p>
</p>

<p>
  Uma versão estável muito usada é a <strong>v0.11.9_cv8</strong>. Para baixar:
</p>

<pre>docker pull biocontainers/fastqc:v0.11.9_cv8</pre>

<blockquote class="warning">
  Esta era a versão estável no momento da escrita. Verifique se há versões mais novas no Docker Hub antes de baixar.
</blockquote>

<h3>2.2 Rodando o container</h3>

<p>Preparando o ambiente de trabalho:</p>

<p>Crie uma pasta para o workflow e um diretório de dados:</p>
<pre>mkdir -p ~/docker_tutorial/data
cd ~/docker_tutorial</pre>

<blockquote class="info">
  Baixe os FASTQs com o <a href="/guias/ferramentas/sra_tools" target="_blank">SRA-Tools</a> (exemplo com o SRR34840432).<br>
  <small>Se você já tem seus <code>.fastq.gz</code>, basta colocá-los em <code>~/docker_tutorial/data</code>.</small>
</blockquote>

<p>Exemplo com dois arquivos FASTQ (R1 e R2):</p>

<pre>mkdir -p results && \
  docker run --rm \
  -u "$(id -u)":"$(id -g)" \
  -v "$(pwd)":/data:rw -w /data \
  biocontainers/fastqc:v0.11.9_cv8 \
  fastqc -o results -t "$(nproc)" data/SRR34840432_1.fastq.gz data/SRR34840432_2.fastq.gz
</pre>

<div class="table-wrap">
  <table>
    <thead>
      <tr>
        <th>Elemento</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code class="codeStyle">mkdir -p results</code></td>
        <td>Cria a pasta <code class="codeStyle">results/</code> no host, se não existir (idempotente).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">--rm</code></td>
        <td>Remove o container ao terminar (não deixa resíduos).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">-u "$(id -u)":"$(id -g)"</code></td>
        <td>Executa como seu usuário/grupo do host; evita arquivos gerados com dono <em>root</em>.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">-v "$(pwd)":/data:rw</code></td>
        <td>Monta a pasta atual em <code class="codeStyle">/data</code> com leitura/escrita (<code class="codeStyle">rw</code>).</td>
      </tr>
      <tr>
        <td><code class="codeStyle">-w /data</code></td>
        <td>Define o diretório de trabalho (<span class="tooltip"><strong>workdir</strong><span class="tooltiptext">Diretório padrão onde os comandos são executados.</span></span>) dentro do container.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">biocontainers/fastqc:v0.11.9_cv8</code></td>
        <td>Imagem usada no <em>run</em>; fornece o executável <code class="codeStyle">fastqc</code> no container.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">fastqc -o results -t "$(nproc)" ...</code></td>
        <td>Roda o FastQC salvando relatórios em <code class="codeStyle">results/</code> (dentro de <code class="codeStyle">/data</code> ⇒ no host: <code class="codeStyle">./results</code>) e usa todos os núcleos disponíveis.</td>
      </tr>
      <tr>
        <td><code class="codeStyle">data/SRR34840432_1.fastq.gz</code> <br><code class="codeStyle">data/SRR34840432_2.fastq.gz</code></td>
        <td>Entradas (FASTQs) vistas pelo container como caminhos relativos ao <code class="codeStyle">/data</code> por causa do <code class="codeStyle">-w /data</code>.</td>
      </tr>
    </tbody>
  </table>
</div>


<blockquote class="tip">
  <strong>Processar tudo de uma vez:</strong>
  <pre>mkdir -p results && \
  docker run --rm -u "$(id -u)":"$(id -g)" -v "$(pwd)":/data -w /data \
  biocontainers/fastqc:v0.11.9_cv8 \
  fastqc -o results -t "$(nproc)" data/*.fastq.gz</pre>
</blockquote>

<h3>2.3 Conferindo os resultados</h3>

<p>Para cada arquivo analisado, o FastQC gera:</p>
<ul>
  <li>Um relatório <code>.html</code> com gráficos de qualidade;</li>
  <li>Um arquivo <code>.zip</code> com dados detalhados.</li>
</ul>

<blockquote class="info">
  Com <code class="codeStyle">-o results</code>, os relatórios do FastQC são salvos em <code class="codeStyle">./results</code> no host
  (garantido pelo mapeamento <code class="codeStyle">-v "$(pwd)":/data</code>, que expõe ao container a pasta do projeto com os arquivos <code class="codeStyle">*.fastq.gz</code> (ex.: <code class="codeStyle">./data/*.fastq.gz</code>) em <code class="codeStyle">/data</code>, e pelo <code class="codeStyle">-w /data</code>, que permite usar caminhos relativos e salvar em <code class="codeStyle">results/</code>.)
</blockquote>


A sua saída deve ser parecida com essa:

![Docker 3](/assets/img/docker/docker_3.png)

<blockquote class="tip">
  <strong>Metáfora rápida (versão estendida):</strong>
  pense no container como um navio; o <code class="codeStyle">-v</code> é o <em>porão</em> abrindo uma escotilha entre o cais (seu host) e o navio (container).
</blockquote>

<h2 id="imagem">3. Criando sua própria imagem (FastQC)</h2>

<p>
  Até agora usamos a imagem pronta do Docker Hub.
  Mas e se você quiser <strong>montar sua própria imagem</strong> com o FastQC instalado?
  Isso é útil quando você precisa de versões específicas ou combinar várias ferramentas no mesmo container.
</p>

<h3>3.1 Preparando a pasta de trabalho</h3>

<pre>mkdir -p ~/docker_tutorial/fastqc_custom
cd ~/docker_tutorial/fastqc_custom</pre>

<p>Essa será a pasta onde vamos salvar o <code>Dockerfile</code> e construir a nova imagem.</p>

<h3>3.2 Criando o Dockerfile</h3>

<p>Use o <code>nano</code> para criar o arquivo:</p>
<pre>nano Dockerfile</pre>

<p>Cole o conteúdo abaixo (imagem base enxuta, locale definido, JRE headless e FastQC):</p>

<pre>
# syntax=docker/dockerfile:1
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive \
    LC_ALL=C.UTF-8 \
    LANG=C.UTF-8

# Instala FastQC e dependências essenciais (Java headless + certificados) e limpa caches
RUN apt-get update &amp;&amp; \
    apt-get install -y --no-install-recommends fastqc default-jre-headless ca-certificates &amp;&amp; \
    rm -rf /var/lib/apt/lists/*

# Diretório de trabalho padrão para I/O
WORKDIR /data

# Executável padrão: permite "docker run minha_img --help"
ENTRYPOINT ["fastqc"]
# Argumento padrão (pode ser sobrescrito): mostra ajuda se rodar sem nada
CMD ["--help"]
</pre>

<blockquote class="info">
  No nano:<br>
  – <kbd>Ctrl</kbd> + <kbd>O</kbd> → salva <kbd>Enter</kbd><br>
  – <kbd>Ctrl</kbd> + <kbd>X</kbd> → sai
</blockquote>

<h3>3.3 Construindo a imagem</h3>

<p>Construa e dê uma tag explícita (boa prática):</p>
<pre>docker build -t meu_fastqc:0.11.9 .</pre>

<ul>
  <li><code>-t meu_fastqc:0.11.9</code>: nome e versão da sua imagem.</li>
  <li><code>.</code>: usa o diretório atual como contexto (onde está o Dockerfile).</li>
</ul>

<blockquote class="tip">
  <strong>Teste rápido:</strong>
  <pre>docker run --rm meu_fastqc:0.11.9 --version</pre>
</blockquote>

<h3>3.4 Rodando sua imagem personalizada</h3>

<p>
  Baixe seus FASTQs (R1/R2). Caso não saiba, veja
  <a href="/guias/ferramentas/sra_tools" target="_blank">este tutorial</a> para obter os arquivos.
</p>

<pre>mkdir -p results && \
docker run --rm \
  -u "$(id -u)":"$(id -g)" \
  -v "$(pwd)":/data:rw -w /data \
  meu_fastqc:0.11.9 \
  -o results -t "$(nproc)" \
  data/SRR34840432_1.fastq.gz data/SRR34840432_2.fastq.gz
</pre>

<blockquote class="tip">
  <strong>Processar todos os FASTQs da pasta:</strong>
  <pre>mkdir -p results && \
docker run --rm \
  -u "$(id -u)":"$(id -g)" \
  -v "$(pwd)":/data:rw -w /data \
  meu_fastqc:0.11.9 \
  -o results -t "$(nproc)" \
  data/*.fastq.gz</pre>
</blockquote>

<h3 id="dockerignore">3.5 Otimizando o build: <code class="codeStyle">.dockerignore</code> e <em>build context</em></h3>

<p>
  Quando você executa <code class="codeStyle">docker build &lt;contexto&gt;</code>, o último argumento é a <strong>pasta de contexto</strong>.
  Em <code class="codeStyle">docker build .</code>, o ponto significa “<em>use a pasta atual como contexto</em>”.
  O cliente Docker empacota (faz um tar) de tudo que está no contexto <em>não ignorado</em> e envia para o
  <span class="tooltip"><strong>daemon<span class="tooltiptext">Serviço <code>dockerd</code> que constrói imagens e executa containers.</span></strong></span>
  fazer o <span class="tooltip"><strong>build<span class="tooltiptext">Processo de criar a imagem a partir do Dockerfile; cada instrução gera/reutiliza camadas (cache).</span></strong></span>.
</p>

<blockquote class="info">
  <strong>Por que isso importa?</strong><br>
  Se o contexto tiver FASTQs/relatórios grandes, o envio (“<em>Sending build context...</em>”) fica lento e
  qualquer mudança nesses arquivos pode invalidar o <span class="tooltip"><strong>cache<span class="tooltiptext">Reuso de camadas já construídas quando nada relevante mudou.</span></strong></span>
  de etapas como <code class="codeStyle">COPY</code>. O <code class="codeStyle">.dockerignore</code> filtra o que entra no contexto, deixando o build mais rápido e previsível.
</blockquote>

<blockquote class="warning">
  <strong>Por que evitar dados no build?</strong><br>
  • Imagens maiores e lentas de distribuir.<br>
  • Cache instável (dados mutáveis quebram camadas).<br>
  • Layers imutáveis: deletar no Dockerfile não “tira” o peso.<br>
  • Risco de comportamento inesperado (configs/artefatos indevidos).<br>
  • Exposição de dados sensíveis.
</blockquote>

<blockquote class="tip">
  <strong>Padrão recomendado:</strong><br>
  • Use <code class="codeStyle">.dockerignore</code> e evite <code class="codeStyle">COPY . .</code>.<br>
  • Copie só o que é necessário para executar a ferramenta.<br>
  • Monte dados em runtime com <code class="codeStyle">-v</code> (<em>bind mount</em>).<br>
  • Se precisar processar no build, use <em>multi-stage</em> e não leve dados ao estágio final.
</blockquote>


<blockquote class="tip">
  <strong>Regra de ouro:</strong> o <code class="codeStyle">.dockerignore</code> fica na <em>mesma pasta do contexto</em> do build. Se você roda <code class="codeStyle">docker build .</code> em <code class="codeStyle">~/docker_tutorial/fastqc_custom</code>, é lá que o <code class="codeStyle">.dockerignore</code> deve existir.
</blockquote>

<h4>3.5.1 Crie um <code class="codeStyle">.dockerignore</code> mínimo</h4>

<p>Abra o arquivo na mesma pasta do seu <code class="codeStyle">Dockerfile</code> e cole o conteúdo abaixo:</p>
<pre>nano .dockerignore</pre>

<blockquote class="info">
  <strong>Por que usar <code class="codeStyle">.dockerignore</code>?</strong><br>
  Ele reduz o tamanho do
  <span class="tooltip"><strong>build context
    <span class="tooltiptext">Tudo que está na pasta usada como contexto (geralmente <code>.</code>) e que é enviado ao Docker para construir a imagem.</span>
  </strong></span>
  deixando os
  <span class="tooltip"><strong>builds
    <span class="tooltiptext">Processo de construir uma imagem a partir do Dockerfile, gerando camadas reutilizáveis.</span>
  </strong></span>
  mais rápidos mantém o
  <span class="tooltip"><strong>cache
    <span class="tooltiptext">Camadas (layers) já construídas que o Docker reaproveita se nada relevante mudou.</span>
  </strong></span>
  previsível e evita enviar dados pesados/sensíveis para o
  <span class="tooltip"><strong>daemon
    <span class="tooltiptext">O serviço em segundo plano do Docker (<code>dockerd</code>) que executa builds, containers, redes e volumes.</span>
  </strong></span>
  durante o build.
</blockquote>

<pre># .dockerignore — recomendado para este tutorial
data/
results/

*.fastq
*.fastq.gz
*.sra
*.zip
*.html
</pre>

<blockquote class="tip">
  <strong>No nano:</strong> <kbd>Ctrl</kbd>+<kbd>O</kbd> para salvar, <kbd>Enter</kbd> para confirmar, depois <kbd>Ctrl</kbd>+<kbd>X</kbd> para sair.
</blockquote>

<h4>3.5.2 Boas práticas rápidas</h4>
<ul>
  <li>Mantenha o contexto enxuto: deixe apenas o que será <code class="codeStyle">COPY</code> junto do Dockerfile; <em>dados</em> ficam fora.</li>
  <li>Prefira montar dados no <code class="codeStyle">docker run</code> com <code class="codeStyle">-v</code> em vez de copiá-los para a imagem.</li>
  <li>Use tags explícitas nas imagens (<code class="codeStyle">meu_fastqc:0.11.9</code>) para builds reproduzíveis.</li>
  <li>Se o Dockerfile estiver em uma subpasta, combine <code class="codeStyle">-f</code> com um contexto mínimo:
    <br><code class="codeStyle">docker build -t meu_fastqc:0.11.9 -f fastqc_custom/Dockerfile fastqc_custom/</code>
  </li>
</ul>

<blockquote class="info">
  <strong>WSL/Docker Desktop:</strong> reduzir o contexto diminui muito o tempo naquele passo “Sending build context to Docker daemon…”.
  Em pastas com FASTQs, a transferência pode chegar a vários GB — o <code class="codeStyle">.dockerignore</code> elimina esse overhead.
</blockquote>

<p>
  Pronto! Agora o comando está rodando com a sua própria imagem em vez de rodar em BioContainers.
</p>

<blockquote class="tip">
  Você pode personalizar ainda mais o Dockerfile, adicionando outras ferramentas
  (ex.: Trimmomatic, MultiQC) e criando um container “tudo em um” para seu pipeline.
</blockquote>

<h3 id="verificacao">3.6 Conferindo a imagem criada</h3>

<p>
  Depois de construir a sua imagem, você pode verificar se ela foi salva no <span class="badge badge--docker">Docker</span> local:
</p>

<pre>docker images</pre>

<p>Saída esperada (exemplo):</p>
<pre>
REPOSITORY    TAG       IMAGE ID       CREATED          SIZE
meu_fastqc    0.11.9    123abc456def   2 minutes ago    350MB
</pre>

<ul>
  <li><strong>REPOSITORY</strong>: nome da imagem (no nosso caso, <code class="codeStyle">meu_fastqc</code>).</li>
  <li><strong>TAG</strong>: versão atribuída (ex.: <code class="codeStyle">0.11.9</code>).</li>
  <li><strong>IMAGE ID</strong>: identificador único da imagem.</li>
  <li><strong>CREATED</strong>: quando foi construída.</li>
  <li><strong>SIZE</strong>: tamanho final da imagem.</li>
</ul>

<p>Se quiser ver detalhes completos (camadas, variáveis de ambiente, comandos padrão), use:</p>
<pre>docker inspect meu_fastqc:0.11.9</pre>

<blockquote class="tip">
  <strong>Dica:</strong> para remover e começar de novo:
  <code class="codeStyle">docker rmi meu_fastqc:0.11.9</code>
</blockquote>

<h3 id="listar-imagens">Como ver (listar) suas imagens</h3>

<pre>docker image ls</pre>

<blockquote class="tip">
  <strong>Filtros úteis:</strong><br>
  <code class="codeStyle">docker image ls meu_fastqc</code><br>
  <code class="codeStyle">docker image ls --filter "reference=meu_fastqc:0.11.9"</code><br>
  <code class="codeStyle">docker image ls -a</code> <small>(inclui camadas intermediárias)</small><br>
  <code class="codeStyle">docker image ls --digests</code> <small>(mostra o digest)</small><br><br>
  <strong>Apenas “dangling” (&lt;none&gt;:&lt;none&gt;):</strong><br>
  <code class="codeStyle">docker image ls --filter dangling=true</code>
</blockquote>

<blockquote class="info">
  <strong>Espaço em disco:</strong><br>
  <code class="codeStyle">docker system df</code>
</blockquote>

<hr>

<h3 id="remover-imagens">Como remover imagens</h3>

<p><strong>Remover uma imagem específica (por nome:tag):</strong></p>
<pre>docker image rm meu_fastqc:0.11.9</pre>

<p><strong>Remover por ID (copie da coluna IMAGE ID):</strong></p>
<pre>docker image rm 123abc456def</pre>

<p><strong>Remover imagens “soltas” (dangling):</strong></p>
<pre>docker image prune -f</pre>

<p><strong>Remover <u>todas</u> as imagens não utilizadas por nenhum container:</strong></p>
<pre>docker image prune -a -f</pre>

<blockquote class="tip">
  <strong>Remover imagens antigas com filtro de tempo:</strong><br>
  <code class="codeStyle">docker image prune -a -f --filter "until=72h"</code>
  <blockquote class="warning">
    <strong>Cuidado:</strong> <code class="codeStyle">prune -a</code> remove qualquer imagem que não esteja em uso
    por um container (inclusive as que você baixou mas não está usando agora).
  </blockquote>
</blockquote>

<p><strong>Remover <u>todas</u> as imagens (força bruta):</strong></p>
<pre>docker image rm $(docker image ls -q)</pre>

---

# Conclusão

<p>
  Fácil, né? Agora você já sabe como instalar o <span class="badge badge--docker">Docker</span>, puxar uma imagem e rodar seu primeiro container.  
  Voltando à metáfora do porto: você aprendeu a receber navios (imagens), descarregar containers (rodar programas) e acessar a carga (seus arquivos e resultados).
</p>

<ul>
  <li><strong>Isolamento:</strong> cada app no seu próprio container.</li>
  <li><strong>Portabilidade:</strong> roda no notebook, servidor ou nuvem.</li>
  <li><strong>Reprodutibilidade:</strong> qualquer pessoa pode repetir a análise.</li>
</ul>

<p>
  O próximo passo é explorar outras imagens do <a href="https://hub.docker.com/" target="_blank">Docker Hub</a>  
  ou até criar sua própria imagem personalizada para pipelines bioinformáticos.
</p>

<blockquote class="tip">
  <strong>Dica:</strong> Combine <span class="badge badge--docker">Docker</span> com workflows (como Nextflow ou Snakemake).  
  Assim, cada etapa roda em seu próprio container, garantindo reprodutibilidade total.
</blockquote>

Missão cumprida, capitão! 🛳️⚓

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZGxtbjVqOWw3dmRtdXB6cHRtbGlvZGV6anFsZ25vOXU0bW5tZHFzdyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3o7abKhOpu0NwenH3O/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)

# Referências

1. <a href="https://docs.docker.com/get-started/" target="_blank">Documentação oficial do Docker</a>  
2. <a href="https://hub.docker.com/" target="_blank">Docker Hub</a>