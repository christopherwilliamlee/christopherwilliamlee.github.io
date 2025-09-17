---
layout: guia
title: Tutorial de instalação do CONDA
permalink: /guias/ambientes/anaconda/
---

![Conda logo](/assets/img/conda/conda_logo.png)

# <u>Instalação do CONDA no WSL</u>

<p style="text-align: justify">
Fala galera, vamos trocar uma ideia sobre <span class="badge badge--conda">Conda</span>?<br>
Quem já tentou configurar um projeto científico ou de desenvolvimento sabe como é fácil cair naquele labirinto de dependências quebradas, versões conflitantes e pacotes que simplesmente não querem instalar. Pois é… o <span class="badge badge--conda">Conda</span> veio justamente pra acabar com essa bagunça.<br>
Em vez de misturar tudo no mesmo lugar, ele permite criar <strong>ambientes independentes</strong>. É como se cada projeto tivesse a sua própria “mini-máquina”, com a versão de Python ou R que ele precisa e todas as bibliotecas certinhas. Resultado: nada de um projeto atrapalhar o outro.<br>
Neste guia, vou te mostrar como instalar o <span style="color:#32CD32; font-weight:bold;">Miniconda</span> (que é a versão mais enxuta e prática) e dar os primeiros passos na criação de ambientes. Depois que você entende a lógica, fica difícil querer trabalhar sem ele.
</p>

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHNiNmViZ2E0a3ZvM3A5ODZ6OXE2aWhma2xxNTB1Yzk5ZW0yeG4yYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gLcsVIjtz907b1ngeQ/giphy.gif" alt="gif" width="220" style="display:block; margin:auto;">

<p>A coisa é bem parecida com o gif acima. É tipo cada um no seu quadrado.</p>

---

# <u>O que é o CONDA?</u>

<p>
O <span class="badge badge--conda">Conda</span> é um gerenciador de pacotes e ambientes multiplataforma que facilita a vida de quem trabalha com ciência de dados, bioinformática ou qualquer área que dependa de várias bibliotecas e softwares diferentes.<br>
Com ele, você pode criar <strong>ambientes isolados</strong>, cada um com sua própria versão de linguagens como Python ou R e todos os pacotes necessários. Isso evita conflitos. Por exemplo: quando um projeto precisa de Python 3.8 e outro exige Python 3.11 já que cada ambiente funciona de forma independente.<br>
E não para por aí: o <span class="badge badge--conda">Conda</span> não se limita a bibliotecas de programação. Ele também gerencia ferramentas de <strong>machine learning</strong>, pacotes estatísticos e até softwares de bioinformática compilados (via <a href="https://bioconda.github.io/" target="_blank">Bioconda</a>). É como ter uma estante organizada onde cada projeto pega exatamente o que precisa, sem bagunçar o resto do sistema.
</p>

O que você vai precisar <u>antes</u>:

- **WSL/Ubuntu** — <a href="/guias/plataforma/wsl/" target="_blank">tutorial aqui</a>;
- **Terminal (WSL)** — PowerShell/Prompt só para baixar/abrir o WSL quando necessário (Caso não tenha instalado ainda, você pode acessar o tutorial <a href="/guias/plataforma/wsl">aqui</a>).

---

## Passo a passo
1. [Instalação](#instalacao)  
2. [Criando um ambiente](#criando-ambiente)

---

<h2 id="instalacao">1. Instalando o CONDA</h2>

![CONDA 1](/assets/img/conda/conda_1.png)

Para começar, entre no site do <a class="badge badge--conda" href="https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html" target="_blank">Conda</a> para baixar o instalador e logo em seguida clique em <span style="color:#32CD32; font-weight:bold;"><u>Miniconda</u></span>. Bem ali onde a flecha está apontando.

![CONDA 2](/assets/img/conda/conda_2.png)

Você vai ser redirecionado para a página do <span style="color:#32CD32; font-weight:bold;">Miniconda</span>. <strong>É nessa página que você vai fazer o download do instalador do <span style="color:#32CD32; font-weight:bold;">Miniconda</span>.</strong>

![CONDA 3](/assets/img/conda/conda_3.png)

No canto esquerdo, na primeira flecha esquerda, clique em <span style="color:#32CD32; font-weight:bold;">Installing Miniconda</span>, depois vá em <em>macOS/Linux Installation</em> e logo em seguida vá em <em>Linux terminal installer</em>. Na quarta seta, você tem um comando para copiar, copie-o e abra o seu WSL.

<blockquote class="info">
Caso não tenha ideia do que seja o <a href="/guias/plataforma/wsl/" target="_blank">WSL</a>, acesse esse link e siga o tutorial para saber o que é e como instalar.
</blockquote>

![CONDA 5](/assets/img/conda/conda_5.png)

Cole esse comando no seu terminal.

<pre>wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh</pre>

<blockquote class="tip">
<strong>Dica:</strong> Para colar no terminal, use <code>Ctrl</code> + <code>Shift</code> + <code>V</code> ou clique com o botão direito do mouse.
</blockquote>

![CONDA 6](/assets/img/conda/conda_6.png)

Depois de baixar o instalador, execute o seguinte comando:

<pre>chmod +x Miniconda3-latest-Linux-x86_64.sh</pre>

<p>Esse comando deixará o seu instalador executável pelo terminal.</p>

![CONDA 7](/assets/img/conda/conda_7.png)

Agora com ele liberado, execute o instalador com o seguinte comando:

<pre>./Miniconda3-latest-Linux-x86_64.sh</pre>

Depois de executar, o programa pedirá para que você tecle <em>ENTER</em> para dar continuidade na instalação.

![CONDA 8](/assets/img/conda/conda_8.png)

<p>
Nesse passo, o programa pedirá para que você dê <em>yes</em> para aceitar os termos.<br>
Na sequência, ele confirma o caminho de instalação. Pressione <em>ENTER</em> para aceitar o padrão.
</p>

![CONDA 9](/assets/img/conda/conda_9.png)

Aqui ele só pergunta se você quer que o <span class="badge badge--conda">Conda</span> inicie junto com o terminal. Caso não ative, você terá que digitar sempre:

<pre>source ~/miniconda3/etc/profile.d/conda.sh
conda activate base</pre>

E para reverter esse processo:

<pre>conda init --reverse</pre>

<blockquote class="info">
Vamos pelo caminho mais fácil, né? Apenas tecle <strong>yes</strong> e <strong>ENTER</strong> e vida que segue!
</blockquote>

Agora, antes de fazer o conda funcionar você vai precisar copiar e digitar o seguinte no seu terminal:

<pre>export PATH=$HOME/miniconda3/bin:$PATH</pre>

<span style="color:red"><strong>FECHE O TERMINAL!</strong></span>

![CONDA 10](/assets/img/conda/conda_10.png)

Abra o terminal de novo e digite agora:

<pre>conda</pre>

Se as opções aparecerem, parabéns! Isso quer dizer que o <span class="badge badge--conda">Conda</span> foi instalado e já está funcionando!

![CONDA 11](/assets/img/conda/conda_11.png)

---

<h2 id="criando-ambiente">2. Criando um ambiente</h2>

Agora digite para listar todos os ambientes instalados:

<pre>conda env list</pre>

<blockquote class="info">
Note que somente aparecerá a <em>base</em> como ambiente. Você não deve (ou depende do seu objetivo) instalar qualquer software na base. Sempre trabalhe em ambientes diferentes.
</blockquote>

Para criar um ambiente é muito fácil! Basta digitar:

<pre>conda create -n (nome_do_seu_ambiente)</pre>

Aperte <em>ENTER</em>, depois tecle <strong>a</strong>, depois <em>ENTER</em> de novo, <strong>a</strong> e <em>ENTER</em> novamente.

![CONDA 12](/assets/img/conda/conda_12.png)

Com isso, ele criará o seu ambiente e depois perguntará se deve proceder com a instalação. Basta digitar <strong>y</strong> e <em>ENTER</em> que ele irá finalizar a criação do ambiente.

Para entrar no seu ambiente recém-criado, basta digitar:

<pre>conda activate (nome_do_seu_ambiente)</pre>

E pronto! Basta olhar no canto esquerdo do terminal para saber se você está dentro do seu ambiente.

---

<p>
E com isso a gente finaliza mais um tutorial de instalação de uma ferramenta muito importante para a ciência de dados e bioinformática.  
Espero que vocês tenham curtido muito. Ahh, e não deixem de me seguir no 
<a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e suportar o meu trabalho.  
Ficarei muito feliz em ter vocês por lá.
</p>

<p>
Ahhh! Aproveite para fazer uma doaçãozinha! Pode ser qualquer valor. Isso vai me ajudar a fortalecer e trazer mais conteúdos para vocês!!
</p>

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHV4N3RkZ2ZsdW1yOGd0bmlzZ3NueXVlOGF1NmNxa3UwZzd2bmJpYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YybKRCSHL1OBW/giphy.gif" alt="gif" width="220" style="display:block; margin:auto;">

---

Se curtiu, dá aquele apoio no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">LinkedIn</a> e considere um cafézinho ☕ para manter o projeto vivo. Valeu!

Pix: [biologolee@gmail.com](mailto:biologolee@gmail.com)<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k  

![QR Code](/assets/img/meus_projetos/bluewallet_qrcode.png)


---

# Referências

1. <a href="https://www.anaconda.com/docs/getting-started/miniconda/main" target="_blank">Documentação oficial do CONDA</a>
