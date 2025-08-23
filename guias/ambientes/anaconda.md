---
layout: guia
title: Tutorial de instalação do CONDA
permalink: /guias/ambientes/anaconda/
---

![Conda logo](/assets/img/conda/conda_logo.png)

# Instalação do CONDA no wsl
Fala galera, vamos trocar uma ideia sobre Conda?
Quem já tentou configurar um projeto em Python sabe como é fácil cair naquele labirinto de dependências quebradas, versões conflitantes e pacotes que simplesmente não querem instalar. Pois é… o Conda veio justamente pra acabar com essa bagunça.

Em vez de misturar tudo no mesmo lugar, ele permite criar ambientes independentes. É como se cada projeto tivesse a sua própria “mini-máquina”, com a versão de Python ou R que ele precisa e todas as bibliotecas certinhas. Resultado: nada de um projeto atrapalhar o outro.

Neste guia, vou te mostrar como instalar o Miniconda (que é a versão mais enxuta e prática) e dar os primeiros passos na criação de ambientes. Depois que você entende a lógica, fica difícil querer trabalhar sem ele.

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHNiNmViZ2E0a3ZvM3A5ODZ6OXE2aWhma2xxNTB1Yzk5ZW0yeG4yYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gLcsVIjtz907b1ngeQ/giphy.gif" alt="gif" width="200" style="display:block; margin:auto;">

A coisa é bem parecida com o gif acima. É tipo cada um no seu quadrado.

# O que é o CONDA?
O CONDA é um gerenciador de pacotes e ambientes que facilita demais a vida de quem trabalha com ciência de dados, bioinformática ou qualquer projeto que dependa de várias bibliotecas diferentes.

Com ele, você pode criar ambientes isolados, cada um com sua própria versão de Python, R e pacotes específicos. Isso significa que você nunca mais vai passar aperto porque um projeto pede Python 3.8 e outro exige Python 3.11. Cada ambiente fica no seu quadrado, sem conflitos.

Além disso, o Conda não se limita só a Python: ele também instala ferramentas de machine learning, pacotes estatísticos e até softwares mais pesados de bioinfo. Ou seja, é como ter uma prateleira organizada onde cada projeto pega exatamente o que precisa, sem bagunçar o resto do sistema.

## Passo a passo
1. Instalação
2. Criando um ambiente


# 1. Instalando o CONDA

![CONDA 1](/assets/img/conda/conda_1.png)

Para começar, entre no site do 
<a href="https://docs.conda.io/projects/conda/en/latest/user-guide/install/index.html" target="_blank">CONDA</a> 
para baixar o instalador e logo em seguida clique em 
<span style="color:#32CD32; font-weight:bold;"><u>Miniconda</u></span>. Bem ali onde a flecha está apontando.


![CONDA 2](/assets/img/conda/conda_2.png)

Você vai ser redirecionado para a página do Miniconda. **É nessa página que você vai fazer o download do instalador do Miniconda.**

![CONDA 3](/assets/img/conda/conda_3.png)

No canto esquerdo, na primeira flecha esquerda, clique em <span style="color:#32CD32; font-weight:bold;">*Installing Miniconda*, depois vá em *macOS/Linux Installation*</span> e logo em seguida vá em *Linux terminal installer*. Na quarta seta, você tem um comando para copiar, copie-o e abra o seu WSL.

> Caso não tenha ideia do que seja o <a href="/guias/plataforma/wsl" target="_blank">WSL</a>, acesse esse link <a href="/guias/plataforma/wsl" target="_blank">WSL</a> e siga o tutorial para saber o que é e para saber como é feita a instalação.

![CONDA 5](/assets/img/conda/conda_5.png)
Cole esse comando no seu terminal.

<pre>wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh</pre>

> Dica: Para colar você pode pressionar o ctrl + shift + v ou então simplesmente apertar o botão direito do mouse.

![CONDA 6](/assets/img/conda/conda_6.png)

Depois de baixar o instalador, execute o seguinte comando:

<pre>chmod +x Miniconda3-latest-Linux-x86_64.sh</pre>

Esse comando deixará o seu instalador executável pelo terminal.

![CONDA 7](/assets/img/conda/conda_7.png)

Agora com ele liberado, execute o instalador com o seguinte comando:
<pre>./Miniconda3-latest-Linux-x86_64.sh</pre>
Depois de executar, o programa pedirá para que você tecle *ENTER* para dar continuidade na instalação.

![CONDA 8](/assets/img/conda/conda_8.png)

Nesse passo, o programa pedirá para que você dê yes para que você concorde em vender a sua alma para o CONDA. Brincadeira (kkkkk)! Ele só está pedindo pra você aceitar os termos.

Na segunda seta, ele está confirmando se você quer instalar no caminho que está escrito ali. É só dar enter para confirmar.

![CONDA 9](/assets/img/conda/conda_9.png)

Aqui ele só pergunta se você quer que o conda inicie assim que o terminal iniciar junto, caso contrário, você terá que digitar sempre:

<pre>source ~/miniconda3/etc/profile.d/conda.sh
conda activate base</pre>

E para reverter esse processo, você deverá digitar:

<pre>conda init --reverse $SHELL</pre>

Vamos pelo caminho mais fácil, né? Apenas tecle ENTER e vida que segue!

Agora, antes de fazer o conda funcionar você vai precisar copiar e digitar o seguinte no seu terminal:

<pre>export PATH=“~/miniconda3/bin:$PATH”</pre>

<span style="color:red">**FECHE O TERMINAL!**</span>

![CONDA 10](/assets/img/conda/conda_10.png)

Abra o terminal de novo e digite agora:
<pre>Conda</pre>
Se as opções aparecerem. Parabéns!! Isso quer dizer que o conda foi instalado e já está funcionando!

![CONDA 11](/assets/img/conda/conda_11.png)

# 2. Criando um ambiente

Agora digite para aparecer todos os ambientes instalados.
<pre>conda env list</pre>

> Note que somente aparecerá a base como ambiente. Estando na base é onde você se guiará para saber em qual ambiente você está. Você não deve (ou deve, dependendo do seu objetivo) instalar qualquer software na base. Sempre trabalhe em ambientes diferentes.

Para criar um ambiente é muito fácil! Basta digitar:

<pre>conda create -n (nome_do_seu_ambiente) </pre>

Aperte ENTER, depois tecle **a**, depois ENTER de novo, **a** e enter de novo.

![CONDA 12](/assets/img/conda/conda_12.png)

Com isso, ele criará o seu ambiente e depois perguntará se deve proceder com a instalação. Basta digitar y e ENTER que ele irá finalizar a criação do ambiente.

Para entrar no seu ambiente recem criado basta digitar:

<pre>conda activate (nome_do_seu_ambiente)</pre>

E pronto! Basta você olhar no canto esquerdo do seu navegador para saber se você está dentro do seu ambiente. 

---

E com isso a gente finaliza mais um tutorial de instalação de uma ferramenta muito importante para a ciência de dados e bioinformática. Espero que vocês tenham curtido muito. Ahh, e não deixem de me seguir no <a href="https://www.linkedin.com/in/christopher-lee-390643197/" target="_blank">linkedin</a> e suportar o meu trabalho. Ficarei muito feliz em ter vocês por lá.
Ahhh! Aproveite para fazer uma doaçãozinha! Pode ser qualquer valor. Isso vai me ajudar a fortalecer e trazer mais conteúdos para vocês!!

Pix: biologolee@gmail.com<br>
Bitcoin: bc1qg7qrfhclzt3sm60en53qv8fmwpuacfaxt5v55k

Até a próxima!<br>

<img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHV4N3RkZ2ZsdW1yOGd0bmlzZ3NueXVlOGF1NmNxa3UwZzd2bmJpYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YybKRCSHL1OBW/giphy.gif" alt="gif" width="200">


---

# Referências

1. <a href="https://www.anaconda.com/docs/getting-started/miniconda/main" target="_blank">Documentação oficial do CONDA</a>