const Database = require('sqlite-async')

function execute(db){
    return db.exec(`
    CREATE TABLE IF NOT EXISTS "Parceiro"(
        id INTEGER NOT NULL,
        id_do_usuario_responsavel INTEGER NOT NULL,
        nome_completo TEXT NOT NULL,
        telefone TEXT NOT NULL,
        cpf TEXT NOT NULL,
        UNIQUE(cpf),
        FOREIGN KEY ("id_do_usuario_responsavel") REFERENCES "Usuario" ("id") ON DELETE Restrict ON UPDATE Cascade,
        PRIMARY KEY(id)
      );
      
      CREATE TABLE IF NOT EXISTS "Estabelecimento"(
        id INTEGER NOT NULL,
        id_do_parceiro_responsavel INTEGER NOT NULL,
        nome TEXT NOT NULL,
        telefone TEXT NOT NULL,
        cnpj TEXT NOT NULL,
        quantidade_de_quartos INTEGER NOT NULL,
        UNIQUE(cnpj),
        FOREIGN KEY ("id_do_parceiro_responsavel") REFERENCES "Parceiro" ("id") ON DELETE Cascade ON UPDATE Cascade,
        PRIMARY KEY(id)
      );
      
      CREATE TABLE IF NOT EXISTS "Usuario"(
        id INTEGER NOT NULL,
        id_do_cargo INTEGER NOT NULL,
        email TEXT NOT NULL,
        token_de_autenticacao TEXT,
        UNIQUE(email),
        FOREIGN KEY (id_do_cargo) REFERENCES "Cargo" (id) ON DELETE Restrict ON UPDATE Cascade,
        PRIMARY KEY(id)
      );
      
      CREATE TABLE IF NOT EXISTS "Conta_bancaria"(
        id INTEGER NOT NULL,
        id_do_estabelecimento INTEGER NOT NULL,
        beneficiario TEXT NOT NULL,
        cpf_ou_cnpj TEXT NOT NULL,
        banco TEXT NOT NULL,
        agencia TEXT NOT NULL,
        numero TEXT NOT NULL,
        digito TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Estabelecimento_Conta_bancaria"
          FOREIGN KEY (id_do_estabelecimento) REFERENCES "Estabelecimento" (id)
            ON DELETE Cascade ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Endereco"(
        id INTEGER NOT NULL,
        id_do_estabelecimento INTEGER NOT NULL,
        tipo_do_logradouro TEXT NOT NULL,
        logradouro TEXT NOT NULL,
        numero TEXT NOT NULL,
        complemento TEXT NOT NULL,
        bairro TEXT NOT NULL,
        cidade TEXT NOT NULL,
        estado TEXT NOT NULL,
        cep TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Estabelecimento_Endereco"
          FOREIGN KEY (id_do_estabelecimento) REFERENCES "Estabelecimento" (id)
            ON DELETE Cascade ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Reserva"(
        id INTEGER NOT NULL,
        id_do_estabelecimento INTEGER NOT NULL,
        id_do_pedido INTEGER,
        codigo TEXT NOT NULL,
        data TEXT NOT NULL,
        valor REAL NOT NULL,
        status TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Estabelecimento_Reserva"
          FOREIGN KEY (id_do_estabelecimento) REFERENCES "Estabelecimento" (id)
            ON DELETE Cascade ON UPDATE Cascade,
        CONSTRAINT "Pedido_Reserva"
          FOREIGN KEY (id_do_pedido) REFERENCES "Pedido" (id) ON DELETE Restrict
            ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Pedido"(
        id INTEGER NOT NULL,
        id_da_modalidade INTEGER NOT NULL,
        id_do_estabelecimento INTEGER NOT NULL,
        data_de_solicitacao TEXT NOT NULL,
        status TEXT NOT NULL,
        PRIMARY KEY(id),
        FOREIGN KEY (id_da_modalidade) REFERENCES "Modalidade_de_antecipacao" (id) ON DELETE Restrict ON UPDATE Cascade,
        FOREIGN KEY (id_do_estabelecimento) REFERENCES "Estabelecimento" (id)
      );
      
      CREATE TABLE IF NOT EXISTS "Modalidade_de_antecipacao"(
        id INTEGER NOT NULL,
        nome TEXT NOT NULL,
        taxa REAL NOT NULL,
        UNIQUE(nome),
        UNIQUE(taxa),
        PRIMARY KEY(id)
      );
      
      CREATE TABLE IF NOT EXISTS "Informacao_de_recebimento"(
        id INTEGER NOT NULL,
        id_do_pedido INTEGER NOT NULL,
        valor_bruto REAL NOT NULL,
        valor_liquido REAL NOT NULL,
        taxa_em_reais REAL NOT NULL,
        data_de_recebimento_prevista TEXT NOT NULL,
        data_de_recebimento_efetiva TEXT,
        tipo TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Pedido_Metodo_de_recebimento"
          FOREIGN KEY (id_do_pedido) REFERENCES "Pedido" (id) ON DELETE Cascade
            ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Pix"(
        id INTEGER NOT NULL,
        id_das_informacoes_de_recebimento INTEGER NOT NULL,
        tipo_da_chave TEXT NOT NULL,
        chave TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Informacoes_de_recebimento_Pix"
          FOREIGN KEY (id_das_informacoes_de_recebimento)
            REFERENCES "Informacao_de_recebimento" (id) ON DELETE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Boleto"(
        id INTEGER NOT NULL,
        id_das_informacoes_de_recebimento INTEGER NOT NULL,
        numero_do_boleto TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Informacoes_de_recebimento_Boleto"
          FOREIGN KEY (id_das_informacoes_de_recebimento)
            REFERENCES "Informacao_de_recebimento" (id) ON DELETE Cascade
            ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Transferencia"(
        id INTEGER NOT NULL,
        id_das_informacoes_de_recebimento INTEGER NOT NULL,
        beneficiario TEXT NOT NULL,
        cpf_ou_cnpj TEXT NOT NULL,
        banco TEXT NOT NULL,
        agencia TEXT NOT NULL,
        numero TEXT NOT NULL,
        digito TEXT NOT NULL,
        PRIMARY KEY(id),
        CONSTRAINT "Informacoes_de_recebimento_Transferencia"
          FOREIGN KEY (id_das_informacoes_de_recebimento)
            REFERENCES "Informacao_de_recebimento" (id) ON DELETE Cascade
            ON UPDATE Cascade
      );
      
      CREATE TABLE IF NOT EXISTS "Cargo"(
        id INTEGER NOT NULL,
        nivel_de_acesso INTEGER NOT NULL,
        nome TEXT NOT NULL,
        UNIQUE(nome),
        PRIMARY KEY(id)
      );

      INSERT OR IGNORE  INTO Cargo("nivel_de_acesso","nome") VALUES("5","parceiro");
      INSERT OR IGNORE  INTO Cargo("nivel_de_acesso","nome") VALUES("10","administrador");

      INSERT OR IGNORE INTO Usuario("id_do_cargo","email") VALUES("2","${process.env._DEFAULT_ADMINISTRATOR_EMAIL}");
      
      INSERT OR IGNORE INTO Modalidade_de_antecipacao("nome","taxa") VALUES("D30",0.00);
      INSERT OR IGNORE INTO Modalidade_de_antecipacao("nome","taxa") VALUES("D15",0.06);
      INSERT OR IGNORE INTO Modalidade_de_antecipacao("nome","taxa") VALUES("D7",0.09);
      INSERT OR IGNORE INTO Modalidade_de_antecipacao("nome","taxa") VALUES("D2",0.12);
    `)
}

module.exports = Database.open(__dirname + '/database.db').then(execute)