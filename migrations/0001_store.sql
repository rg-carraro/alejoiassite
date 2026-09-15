CREATE TABLE products(id TEXT PRIMARY KEY, slug TEXT UNIQUE NOT NULL, data TEXT NOT NULL);
CREATE TABLE history(seq INTEGER PRIMARY KEY, product_id TEXT, at TEXT, actor TEXT, source TEXT, before_json TEXT, after_json TEXT);
CREATE INDEX history_product ON history(product_id, seq);
CREATE TABLE settings(key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE sessions(token TEXT PRIMARY KEY, expires INTEGER);
CREATE TABLE limits(key TEXT PRIMARY KEY, count INTEGER, until INTEGER);
CREATE TABLE requests(id TEXT PRIMARY KEY, request_key TEXT UNIQUE, hash TEXT, data TEXT, status TEXT, created_at TEXT);
CREATE INDEX requests_created ON requests(created_at);
CREATE TABLE request_history(seq INTEGER PRIMARY KEY, request_id TEXT, status TEXT, at TEXT, actor TEXT);
CREATE TABLE media(name TEXT PRIMARY KEY, content BLOB NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL CHECK(size <= 300000));
CREATE TABLE guards(id INTEGER PRIMARY KEY, valid INTEGER CHECK(valid = 1));
INSERT INTO settings VALUES('catalog_revision','0');
-- A transação D1 valida a versão lida antes de gravar qualquer lote/pedido.
CREATE TRIGGER catalog_insert AFTER INSERT ON products BEGIN UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='catalog_revision'; END;
CREATE TRIGGER catalog_update AFTER UPDATE ON products BEGIN UPDATE settings SET value=CAST(value AS INTEGER)+1 WHERE key='catalog_revision'; END;
-- Margem em relação aos 500 MB por banco do plano gratuito. Fotos nunca são apagadas automaticamente.
CREATE TRIGGER media_capacity BEFORE INSERT ON media WHEN (SELECT COALESCE(SUM(size),0) FROM media) + NEW.size > 100000000
BEGIN SELECT RAISE(ABORT, 'Limite de fotos atingido. Exporte um backup e revise a capacidade.'); END;
