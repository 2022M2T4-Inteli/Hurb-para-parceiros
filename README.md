# Inteli - Instituto de Tecnologia e Liderança 

<p align="center">
<a href= "https://www.inteli.edu.br/"><img src="https://www.inteli.edu.br/wp-content/uploads/2021/08/20172028/marca_1-2.png" alt="Inteli - Instituto de Tecnologia e Liderança" border="0"></a>
</p>

# Sistema de antecipação de receita de hotéis parceiros


## Hurb para parceiros

## Integrantes: <a href="https://www.linkedin.com/in/andrelessajr/">André Luís Lessa Junior</a>, <a href="https://www.linkedin.com/in/camila-anacleto-63101312b/">Camila Fernanda de Lima Anacleto</a>, <a href="https://www.linkedin.com/in/eliasbiondo/">Elias Biondo</a>, <a href="https://www.linkedin.com/in/kaique-ramon-6975751a3/">Kaique Ramon Nogueira Dantas</a>, <a href="https://www.linkedin.com/in/matheus-fidelis-680520232/">Matheus Fidelis dos Santos Pinto</a>,<a href="https://www.linkedin.com/in/uelitonrocha">Ueliton Moreira Rocha</a>

## Descrição

📜 Descrição da solução prosposta
<br><br>
Para este módulo tivemos como parceiro de projeto a Hurb, uma empresa que detém uma plataforma de reserva de hotéis e vendas de pacotes de viagem. Nela, as redes hoteleiras recebem os repasses das estadias dos clientes, sem taxa, somente após 30 dias dos checkouts (D+30). Porém, existe a possibilidade de os hotéis anteciparem os seus recebimentos em troca de uma taxa que varia com a urgência da antecipação (D+2, D+7, D+15). Esse sistema, atualmente, é completamente manual e controlado por somente uma equipe. Sendo assim, o objetivo do projeto é criar um programa que controle os pedidos de antecipação dos hotéis e repasse para o financeiro da Hurb de forma automática e instantânea. <br>
Então, para atingirmos o objetivo da Hurb, começamos por introduzir uma tela de login dos usuários já cadastrados no sistema dela, assim como os administradores da mesma. Tudo isso protegido por um sistema de verificação de duas etapas. 
Na área de usuários, a primeira opção que tem é para selecionar o hotel em questão (caso a rede possua mais que um). Após isso, o aplicativo mostrará a quantidade de checkouts e o valor totais pendentes. Caso o usuário queira solicitar uma antecipação, o programa faz uma simulação em que o hotel informa em quantos dias e qual valor quer receber. Com isso, o aplicativo retorna o valor a ser recebido, a taxa e a quantidade de diárias e números de pedidos que compõem tal antecipação (ou seja, retorna um resumo do pedido). Se o usuário resolva concluir o pedido, o programa abre uma página para informar os dados bancários ou pix para a conclusão da transferência. Por fim, existe uma aba de calendário para o usuário monitorar os dias de recebimento e o valor total das antecipações de cada mês.<br>
Já a área dos administradores (funcionários da Hurb) é voltada completamente para o controle gerencial de todos os usuários. Foram criadas abas como: cadastrar novo usuário, registrar novo parceiro, criar novo estabelecimento/reserva e criar nova modalidade. Tudo isso, gerando bancos de dados que irão para o aplicativo e para os departamentos responsáveis. Além da principal aba, que é gerenciar solicitação; onde o administrador poderá ver todos os pedidos de antecipação (com o nome do usuário, estabelecimento, modalidade de antecipação, valor e tipo de transferência). Por fim, foi também criada uma aba de estatísticas para a coleta e análise de dados pela Hurb.
<br><br>

## 🛠 Estrutura de pastas<br>
**|-->** documentos<br>
&emsp;**| -->** outros<br>
&emsp;&emsp;| T4_G5_V_2_2_Web_Application_document.docx<br>
&emsp;&emsp;| T4_G5_V_2_2_Web_Application_document.pdf<br>
**|-->** imagens<br>
**|-->** src<br>
&emsp;**|--> Backend**<br>
&emsp;**|--> Frontend**<br>
&emsp;|--> readme.md<br>
&emsp;|---> license.txt<br>

Dentre os arquivos presentes na raiz do projeto, definem-se:

**readme.md**: arquivo que serve como guia e explicação geral sobre o projeto (o mesmo que você está lendo agora).

**documentos**: aqui estarão todos os documentos do projeto. Há também uma pasta denominada outros onde estão presentes aqueles documentos complementares ao web application document.

**imagens**: imagens relacionadas ao projeto como um todo (por exemplo imagens do sistema, do grupo, logotipos e afins).

**src**: nesta pasta encontra-se todo o código fonte do sistema (existem duas subpastas backend e frontend que contêm, respectivamente, o código do servidor e o código da página web).

## 💻 Configuração para Desenvolvimento

Aqui encontram-se todas as instruções necessárias para a instalação de todos os programas, bibliotecas e ferramentas imprescindíveis para a configuração do ambiente de desenvolvimento.<br>

Baixar e instalar o **node.js**: https://nodejs.org/pt-br/ (versão 16.15.1 LTS)<br>
Clone o repositório em questão.<br>
No modo administrador, abra o "prompt de comando" ou o "terminal" e, após, abra a pasta "**src/backend**" no diretório raiz do repositório clonado e digite o segundo comando:<br>
  
```npm install```

  <br>Isso instalará todas as dependências definidas no arquivo package.json que são necessárias para rodar o projeto. Agora o projeto já está pronto para ser modificado. Caso ainda deseje iniciar a aplicação, digite o comando abaixo no terminal:

```npm start```

Pronto. O servidor está online.

## 🗃 Histórico de lançamentos

A cada atualização os detalhes devem ser lançados aqui.

A cada atualização os detalhes devem ser lançados aqui.

* 1.4.5 - 03/06/2022
    * MUDANÇA: Adição de apêndice com link da documentação.
* 1.4.0 - 30/05/2022
    * MUDANÇA: Adição da arquitetura do sistema e visão geral no
formato big picture.
* 1.3.0 - 27/05/2022
    * MUDANÇA:Atualização da seção 3.2 e adição da seção 5, 5.1 e
5.2.
* 1.2.0 - 13/05/2022
    * MUDANÇA:Adição da seção 4.2.
* 1.1.0 - 04/05/2022
    * MUDANÇA: Formatação da seção 3.2 e adição da seção 4.
* 1.0.0 - 02/05/2022
    * Criação do documento: adição da seção 1, 2, 3, 4
    

## 📋 Licença/License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/2022M2T4/Projeto5">Hurb para parceiros</a> By - <a href="https://www.inteli.edu.br/">INTELI</a>, André Luís Lessa Junior, Camila Fernanda de Lima Anacleto, Elias Biondo, Kaique Ramon Nogueira Dantas, Matheus Fidelis dos Santos Pinto e Ueliton Moreira Rocha </a> is licensed under <a href="http://creativecommons.org/licenses/by/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">Attribution 4.0 International<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"></a></p>

## 🎓 Referências

Aqui estão as referências usadas no projeto.

1. <https://stackoverflow.com/>
2. <https://www.w3schools.com/>
3. <https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js>
