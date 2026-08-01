-- ============================================
-- GLOW FITNESS - Seed Data
-- ============================================

-- CATEGORIES
INSERT INTO categories (id, name, slug, description, image, "order", active, is_highlight_circle, highlight_color) VALUES
('cat-macaquinho', 'Macaquinho', 'macaquinho', 'Macaquinhos fitness de alta compressão, conforto e estilo.', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=500&auto=format&fit=crop&q=80', 1, true, false, NULL),
('cat-conjuntos', 'Conjuntos', 'conjuntos', 'Conjuntos combinados de top e legging/shorts para treinar no estilo.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80', 2, true, false, NULL),
('cat-shorts', 'Shorts', 'shorts', 'Shorts e biker shorts com empina bumbum e bolso lateral.', 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=500&auto=format&fit=crop&q=80', 3, true, false, NULL),
('cat-tops', 'Tops', 'tops', 'Tops com bojo removível e sustentação para alta e média intensidade.', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80', 4, true, false, NULL),
('cat-leggings', 'Leggings', 'leggings', 'Leggings cós alto, sem transparência e tecido respirável.', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop&q=80', 5, true, false, NULL),
('cat-novidades', 'Novidades', 'novidades', 'Lançamentos exclusivos da coleção Glow Fitness.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80', 6, true, true, '#C18282');

-- PRODUCTS
INSERT INTO products (id, name, slug, short_description, full_description, category_id, category_name, brand, collection, price, promotional_price, sku, barcode, stock, min_stock, status, is_featured, is_new, is_best_seller, is_on_sale, tags, images, rating, reviews_count, weight_kg, dimensions_cm) VALUES
('prod-1', 'Conjunto Energy', 'conjunto-energy', 'Conjunto de top com bojo removível e legging cós super alto em tom vinho bordô.', 'O Conjunto Energy foi projetado para elevar seus treinos a outro nível. Confeccionado em poliamida com elastano de alta gramatura, oferece zero transparência, toque macio, secagem rápida e média compressão que modela o corpo com extremo conforto.', 'cat-conjuntos', 'Conjuntos', 'Glow Fitness', 'Coleção Energy 2024', 129.90, 129.90, 'GLOW-CONJ-ENG-01', '7891234567890', 25, 3, 'active', true, true, true, false, ARRAY['conjunto','vinho','bordo','energia','legging','top'], ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80'], 4.9, 38, 0.45, '{"height": 5, "width": 20, "length": 25}'),
('prod-2', 'Shorts Power', 'shorts-power', 'Shorts de alta compressão com bolso lateral para celular e cós anatômico.', 'O Shorts Power combina praticidade e funcionalidade. Possui bolso lateral ideal para armazenar celular ou chaves, cós anatômico que não enrola durante os exercícios e tecido respirável que mantém a pele seca.', 'cat-shorts', 'Shorts', 'Glow Fitness', 'Coleção Essential', 89.90, 89.90, 'GLOW-SHORTS-PWR-01', '7891234567891', 40, 5, 'active', true, false, true, false, ARRAY['shorts','preto','bolso','power','biker'], ARRAY['https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80'], 4.8, 52, 0.22, '{"height": 3, "width": 15, "length": 20}'),
('prod-3', 'Top Nadador', 'top-nadador', 'Top esportivo clássico com costas nadador e cós elástico reforçado.', 'Essencial no guarda-roupa fitness, o Top Nadador garante sustentação ideal para caminhadas, musculação e treinos funcionais. Acompanha bojo removível lavável e forro duplo antitranspiração.', 'cat-tops', 'Tops', 'Glow Fitness', 'Coleção Essential', 79.90, 79.90, 'GLOW-TOP-NAD-01', '7891234567892', 30, 5, 'active', true, false, true, false, ARRAY['top','nadador','preto','sustentacao'], ARRAY['https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80'], 5.0, 29, 0.18, '{"height": 2, "width": 15, "length": 18}'),
('prod-4', 'Macaquinho Fit', 'macaquinho-fit', 'Macaquinho ciclista com decote anatômico em tom lilás lavanda elegante.', 'O Macaquinho Fit é a escolha perfeita para quem busca praticidade sem abrir mão do estilo. Peca única que valoriza a silhueta com tecido de média compressão, elasticidade 360º e acabamento premium.', 'cat-macaquinho', 'Macaquinho', 'Glow Fitness', 'Coleção Glow Pastel 2024', 149.90, 149.90, 'GLOW-MAC-FIT-01', '7891234567893', 18, 2, 'active', true, true, false, false, ARRAY['macaquinho','lilas','fit','onepiece','lavanda'], ARRAY['https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80'], 4.9, 17, 0.38, '{"height": 4, "width": 20, "length": 22}'),
('prod-5', 'Legging Seamless Glow', 'legging-seamless-glow', 'Legging sem costura frontal com efeito empina bumbum e cós alto chapa barriga.', 'Tecnologia Seamless (sem costura) para o máximo de liberdade de movimento. Desenvolvida para zerar o atrito, proporcionar compressão pontual estratégica e elevar a autoestima.', 'cat-leggings', 'Leggings', 'Glow Fitness', 'Coleção Sculpt', 119.90, 99.90, 'GLOW-LEG-SEA-01', '7891234567894', 32, 4, 'active', false, true, true, true, ARRAY['legging','seamless','sem costura','rosa','dusty rose'], ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80','https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&auto=format&fit=crop&q=80'], 5.0, 44, 0.32, '{"height": 4, "width": 18, "length": 22}'),
('prod-6', 'Top Asimétrico Glow', 'top-asimetrico-glow', 'Top fitness de um ombro só com alta sustentação e design moderno.', 'Destaque-se na academia com o Top Asimétrico Glow! Corte moderno de um ombro só, reforçado com elástico duplo interno que segura perfeitamente durante a movimentação.', 'cat-tops', 'Tops', 'Glow Fitness', 'Coleção Trend', 84.90, 84.90, 'GLOW-TOP-ASI-01', '7891234567895', 22, 3, 'active', false, true, false, false, ARRAY['top','asimétrico','um ombro','trend','preto'], ARRAY['https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80'], 4.7, 12, 0.16, '{"height": 2, "width": 15, "length": 18}');

-- PRODUCT VARIATIONS
INSERT INTO product_variations (id, product_id, color_name, color_hex, size, sku, price, stock) VALUES
('v1-1', 'prod-1', 'Bordô / Vinho', '#581825', 'P', 'GLOW-CONJ-ENG-P', 129.90, 8),
('v1-2', 'prod-1', 'Bordô / Vinho', '#581825', 'M', 'GLOW-CONJ-ENG-M', 129.90, 10),
('v1-3', 'prod-1', 'Bordô / Vinho', '#581825', 'G', 'GLOW-CONJ-ENG-G', 129.90, 7),
('v2-1', 'prod-2', 'Preto Absoluto', '#121212', 'P', 'GLOW-SHORTS-PWR-P', 89.90, 15),
('v2-2', 'prod-2', 'Preto Absoluto', '#121212', 'M', 'GLOW-SHORTS-PWR-M', 89.90, 15),
('v2-3', 'prod-2', 'Preto Absoluto', '#121212', 'G', 'GLOW-SHORTS-PWR-G', 89.90, 10),
('v3-1', 'prod-3', 'Preto Onix', '#1A1A1A', 'P', 'GLOW-TOP-NAD-P', 79.90, 10),
('v3-2', 'prod-3', 'Preto Onix', '#1A1A1A', 'M', 'GLOW-TOP-NAD-M', 79.90, 12),
('v3-3', 'prod-3', 'Preto Onix', '#1A1A1A', 'G', 'GLOW-TOP-NAD-G', 79.90, 8),
('v4-1', 'prod-4', 'Lilás Lavanda', '#A288E3', 'P', 'GLOW-MAC-FIT-P', 149.90, 5),
('v4-2', 'prod-4', 'Lilás Lavanda', '#A288E3', 'M', 'GLOW-MAC-FIT-M', 149.90, 8),
('v4-3', 'prod-4', 'Lilás Lavanda', '#A288E3', 'G', 'GLOW-MAC-FIT-G', 149.90, 5),
('v5-1', 'prod-5', 'Rosa Dusty Rose', '#C18282', 'P', 'GLOW-LEG-SEA-P', 99.90, 10),
('v5-2', 'prod-5', 'Rosa Dusty Rose', '#C18282', 'M', 'GLOW-LEG-SEA-M', 99.90, 12),
('v5-3', 'prod-5', 'Rosa Dusty Rose', '#C18282', 'G', 'GLOW-LEG-SEA-G', 99.90, 10),
('v6-1', 'prod-6', 'Preto', '#121212', 'P', 'GLOW-TOP-ASI-P', 84.90, 8),
('v6-2', 'prod-6', 'Preto', '#121212', 'M', 'GLOW-TOP-ASI-M', 84.90, 8),
('v6-3', 'prod-6', 'Preto', '#121212', 'G', 'GLOW-TOP-ASI-G', 84.90, 6);

-- COUPONS
INSERT INTO coupons (id, code, type, value, min_order_value, max_usage, used_count, expires_at, active) VALUES
('coup-1', 'GLOW10', 'percentage', 10, 100, 1000, 142, '2026-12-31', true),
('coup-2', 'FRETEGRATIS', 'free_shipping', 0, 199, 500, 88, '2026-12-31', true),
('coup-3', 'PRIMEIRACOMPRA', 'percentage', 15, 150, 2000, 310, '2026-12-31', true);

-- BANNERS
INSERT INTO banners (id, title, subtitle, desktop_image, mobile_image, cta_text, cta_url, position, active, "order") VALUES
('ban-1', 'SEJA SUA MELHOR VERSÃO', 'Moda fitness para mulheres que querem se sentir lindas, confiantes e confortáveis.', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80', 'CONHEÇA A COLEÇÃO', '#produtos', 'hero', true, 1);

-- REVIEWS
INSERT INTO reviews (id, product_id, product_name, author, rating, comment, status) VALUES
('rev-1', 'prod-1', 'Conjunto Energy', 'Mariana Silva', 5, 'Tecido incrível! Zero transparência na agachamento e a cor vinho é exatamente como na foto! Apaixonada.', 'approved'),
('rev-2', 'prod-2', 'Shorts Power', 'Camila Fernandes', 5, 'O bolso lateral para colocar o celular mudou meus treinos de corrida. Não atrita nas coxas.', 'approved'),
('rev-3', 'prod-4', 'Macaquinho Fit', 'Beatriz Lima', 5, 'Lindo demais! Veste super bem, modela a cintura sem apertar demais. Recebi vários elogios na academia.', 'approved');

-- BLOG POSTS
INSERT INTO blog_posts (id, title, slug, summary, content, cover_image, author, tags) VALUES
('post-1', 'Como escolher o top fitness ideal para seu tipo de treino', 'como-escolher-top-fitness-ideal', 'Aprenda a escolher o nível de sustentação, tecido e modelagem perfeita para corrida, crossfit ou ioga.', 'Escolher o top esportivo certo é fundamental para o conforto e a saúde das mamas durante a prática física. Treinos de alto impacto exigem tops com alças mais largas e costas nadador, enquanto práticas sutis como yoga podem priorizar modelos sem costura e toque leve...', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80', 'Equipe Glow Fitness', ARRAY['Dicas de Treino','Moda Fitness','Tops']),
('post-2', 'Tecnologia Seamless: Por que as roupas sem costura são tendência mundial?', 'tecnologia-seamless-roupas-sem-costura', 'Descubra como é fabricada a linha Seamless e por que ela oferece zero atrito e liberdade total de movimento.', 'O processo Seamless une fios inteligentes em teares circulares de alta tecnologia, eliminando costuras laterais incômodas. O resultado é uma peça de vestir que abraça as curvas com sensação de segunda pele...', 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80', 'Luiza Glow', ARRAY['Tecnologia','Seamless','Leggings']);

-- HOME SECTIONS
INSERT INTO home_sections (id, title, type, enabled, "order") VALUES
('sec-announcement', 'Barra de Anúncios Topo', 'announcement', true, 1),
('sec-hero', 'Hero Banner Principal', 'hero', true, 2),
('sec-categories', 'Carrossel de Categorias Circulares', 'categories', true, 3),
('sec-highlights', 'Produtos em Destaque', 'highlights', true, 4),
('sec-about', 'Quem Somos (História & Marca)', 'about', true, 5),
('sec-testimonials', 'Depoimentos de Clientes', 'testimonials', true, 6),
('sec-instagram', 'Feed do Instagram', 'instagram', true, 7),
('sec-newsletter', 'Captura de Newsletter', 'newsletter', true, 8),
('sec-footer', 'Rodapé Institucional', 'footer', true, 9);

-- THEME CONFIG
INSERT INTO theme_config (id, primary_color, secondary_color, accent_color, background_color, text_color, card_background_color, button_radius, font_family) VALUES
('default', '#C18282', '#1A1A1A', '#EAD3D0', '#FAF7F6', '#1A1A1A', '#FFFFFF', 'sm', 'sans');

-- STORE SETTINGS
INSERT INTO store_settings (id, store_name, slogan, logo_url, favicon_url, phone, whatsapp, email, instagram, facebook, tiktok, youtube, address, business_hours, free_shipping_threshold, mercado_pago_public_key, mercado_pago_access_token, seo_title, seo_description, google_analytics_id, meta_pixel_id) VALUES
('default', 'Glow Fitness', 'Moda fitness que valoriza seu corpo, sua força e sua essência.', '', '', '(11) 99999-9999', '5511999999999', 'contato@glowfitness.com.br', 'glowfitness_oficial', 'glowfitnessoficial', 'glowfitness', 'glowfitness', 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP', 'Seg a Sex: 9h às 18h | Sábado: 9h às 13h', 199, 'TEST-7a8b9c1d-2e3f-4a5b-6c7d-8e9f0a1b2c3d', 'TEST-89213019823091823901823091', 'Glow Fitness | Moda Fitness Feminina', 'Moda fitness feminina premium. Tops, leggings, macaquinhos e conjuntos de alta compressão e conforto.', 'G-XXXXXXXXXX', '123456789012345');
