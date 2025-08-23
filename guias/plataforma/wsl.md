---
layout: guia
title: Tutorial de instalação do Windows Subsystem for Linux (WSL)
permalink: /guias/plataforma/wsl/
---

![Etapa - 15 WSL](/assets/img/wsl/wsl_logo_1.png)

# Instalação do WSL (Windows Subsystem for Linux) no Windows

Fala pessoal, aqui eu vou ensinar vocês a instalarem o WSL na máquina de vocês. É extremamente útil pra quem não quer trabalhar com dual boot ou máquina virtual (virtual box). Eu mesmo já tentei trabalhar com o ubuntu como sistema operacional principal, só que não foi porque foi uma coisa de outro mundo. É porque existem alguns softwares que não são utilizáveis no ubuntu ou até mesmo jogos (quem não gosta de um GTAV ou até mesmo um lolzinho, né?). Por isso acho muito mais viável trabalhar com o WSL que qualquer outra coisa. Nesse tutorial você vai aprender a fazer a instalação do WSL no SO windows. É bem simples! E nooooo.... como faz diferença!<br>

<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXZkNndpenJjNjhkM3BtcHUwdm14ejM5OHNldWk5ZDZxb2ZoMnU3YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEduZtPOv5OSecubu/giphy.gif" alt="gif" width="200">


Mas primeiramente...<br>
# O que é o WSL?
O WSL <strong>(Windows Subsystem for Linux)</strong> permite rodar distribuições Linux diretamente no Windows, sem precisar de máquina virtual ou dual boot.<br>
É extremamente útil para bioinformática e desenvolvimento, pois você pode usar o Ubuntu com as ferramentas de linha de comando e ainda manter seus programas do Windows.


## Passo a passo
1. Verificar versão do Windows
2. Instalar o WSL
3. Ativar o WSL
4. Criar um username e password


# 1. Verifique a versão do windows

O WSL 2 funciona a partir do **Windows 10 versão 2004 (Build 19041)** ou superior. Para verificar, pressione:

<pre>Win + R → digite winver → Enter</pre>

Algo como isso deverá aparecer:

![Exemplo da janela Winver](/assets/img/wsl/wsl_1.png)

# 2. Instalar o WSL

Esse passo é bem simples, consiste apenas em entrar no site <a href="https://ubuntu.com/desktop/wsl" target="_blank">Ubuntu</a>.

Depois de ter acessado o site clique em **Download Ubuntu on WSL**.<br>

![Página de download do Ubuntu no WSL](/assets/img/wsl/wsl_2.png)

Localize o arquivo baixado (geralmente está em downloads).<br>

![Arquivo de instalação baixado](/assets/img/wsl/wsl_3.png)

Clique duas vezes sobre o instalador

![Arquivo de instalação baixado](/assets/img/wsl/wsl_4.png)
Ele começará a instalar sozinho

![Arquivo de instalação baixado](/assets/img/wsl/wsl_5.png)
**<u style="color:red">Para ser sincero, eu não tenho muita certeza se aqui nessa parte continua da mesma forma.</u>** Eu instalei o meu wsl há muito tempo e como era uma versão mais antiga algo pode ter mudado. Mas não se preocupe, se algo der errado aqui, você pode pular para a etapa 5.

## 3. Cadastrar login e senha

![Arquivo de instalação baixado](/assets/img/wsl/wsl_6.png)
Ao finalizar, ele pedirá para que você insira o nome do usuário e a senha. Note que ao digitar a senha, você não verá a senha sendo digitada, portanto, lembre-se do que você está digitando. Caso não lembre, aperte o backspace como nunca (claro que não precisa ser para sempre, mas aperte o suficiente para apagar tudo aquilo que você escreveu). 

![Arquivo de instalação baixado](/assets/img/wsl/wsl_7.png)
Note que aqui ele dirá:
<pre>passwd: password updated successfully</pre>

Isso indica que deu tudo certo! Agora você está pronto para utilizar.

## 4. Ativar o WSL (Etapa adicional)

Você precisará apenas seguir nessa etapa se deu algum problema nas etapas anteriores.

![Etapa - 8 WSL](/assets/img/wsl/wsl_8.png)
Abra a lupa do windows ou aperte a tecla windows e digite:
<pre>powershell</pre>

Clique com o botão direito em cima do ícone do *Windows PowerShell* e execute como administrador.

![Etapa - 9 WSL](/assets/img/wsl/wsl_9.png)
O powershell irá abrir. Agora digite:

<pre>wsl --install</pre>

Ele começará a instalar. Assim que terminar, feche o *powershell*.

![Etapa - 10 WSL](/assets/img/wsl/wsl_10.png)

Agora vá de novo até a lupa do windows e digite:

<pre>painel de controle</pre>

Clique em cima de programas.

![Etapa - 11 WSL](/assets/img/wsl/wsl_11.png)

Abrindo a pasta de Programas, clique em ativar ou desativar recursos do Windows.

![Etapa - 12 WSL](/assets/img/wsl/wsl_12.png)

Uma janela chamada Recursos do windows irá abrir. Procure pela opção Subsistema do Windows para Linux e ative-a.

Pronto. Reinicie o computador e assim que reiniciar, procure por **Ubuntu** no menu iniciar e inicie o terminal. Agora ele está pronto para ser usado.

## 5. Erros comuns

### Erro 0x80070002
![Etapa - 13 WSL](/assets/img/wsl/wsl_13.png)
Causa: O Windows não consegue encontrar os arquivos necessários para a instalação. Solução:
<pre>wsl --install</pre>
Verifique se o Windows está atualizado. Reinicie o PC e tente novamente.

### Erro 0x800701bc
![Etapa - 14 WSL](/assets/img/wsl/wsl_14.png)

Causa: A versão do WSL requer um kernel atualizado. Solução:
Baixe e instale o kernel mais recente: https://aka.ms/wsl2kerne
Reinicie o PC e tente novamente.

### Erro 0x80370102
![Etapa - 15 WSL](/assets/img/wsl/wsl_15.png)

Causa: O WSL 2 exige que a virtualização esteja habilitada no BIOS. Solução:
Habilite a virtualização no BIOS (Intel VT-x ou AMD-V).
Ative os recursos do Windows:
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart Reinicie o PC e tente novamente.


---

Espero que vocês valorizem esse trabalho aqui. Pra poder fazer esse tutorial do 0, eu fiz a cagada de desinstalar o wsl e foi tudo pro beleléu. Perdi todos os meus projetos. A minha sorte é que a maioria tava escrito no github.<br>

Boa sorte na jornada de vocês e qualquer coisa que precisarem podem me enviar e-mail.

Te vejo na próxima!<br>
<img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXpybmFyM2EzYmgxcDdwMHVpajExcjJ1aWp0dnh1OXRvZXhyM3lveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l1J3CbFgn5o7DGRuE/giphy.gif" alt="gif" width="250">


## Referências

1. <a href="https://learn.microsoft.com/pt-br/windows/wsl/" target="_blank">Documentação oficial do WSL</a>
2. <a href="https://aka.ms/wsl2kernel" target="_blank">Download do kernel atualizado</a>

