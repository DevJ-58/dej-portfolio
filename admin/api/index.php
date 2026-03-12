<?php
require_once dirname(__DIR__) . '/config.php';
setApiHeaders();

$section = $_GET['section'] ?? '';
$method  = $_SERVER['REQUEST_METHOD'];
$body    = json_decode(file_get_contents('php://input'), true) ?? [];

switch ($section) {

    // ==================== LOGIN ====================
    case 'login':
        if ($method === 'POST') {
            $db    = getDB();
            $email = trim($body['email'] ?? '');
            $pass  = $body['password'] ?? '';
            if (!$email || !$pass) jsonError('Email et mot de passe requis');
            $stmt = $db->prepare("SELECT * FROM admin_users WHERE email = :email LIMIT 1");
            $stmt->execute([':email' => $email]);
            $admin = $stmt->fetch();
            if ($admin && password_verify($pass, $admin['password'])) {
                $token = generateToken((int)$admin['id'], $admin['email']);
                jsonSuccess(['token' => $token, 'email' => $admin['email']], 'Connexion réussie');
            }
            jsonError('Email ou mot de passe incorrect', 401);
        }
        break;

    // ==================== LOGOUT ====================
    case 'logout':
        jsonSuccess(null, 'Déconnecté');
        break;

    // ==================== CHECK-AUTH ====================
    case 'check-auth':
        $payload = requireAuth();
        jsonSuccess(['email' => $payload['email'], 'id' => $payload['id']]);
        break;

    // ==================== HERO ====================
    case 'hero':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM hero WHERE id=1")->fetch());
        }
        if ($method === 'POST') {
            requireAuth();
            $fields = ['nom','titre_principal','titres_animes','description','stat_projets','stat_annees','stat_satisfaction','github','linkedin','whatsapp','facebook'];
            $sets = []; $params = [];
            foreach ($fields as $f) {
                if (array_key_exists($f, $body)) { $sets[] = "$f=:$f"; $params[":$f"] = $body[$f]; }
            }
            if (!empty($_FILES['photo']['tmp_name'])) {
                $url = uploadImage($_FILES['photo'], 'hero');
                if ($url) { $sets[] = "photo=:photo"; $params[':photo'] = $url; }
            } elseif (!empty($body['photo'])) {
                $sets[] = "photo=:photo"; $params[':photo'] = $body['photo'];
            }
            if ($sets) $db->prepare("UPDATE hero SET " . implode(',', $sets) . " WHERE id=1")->execute($params);
            jsonSuccess($db->query("SELECT * FROM hero WHERE id=1")->fetch(), 'Hero mis à jour');
        }
        break;

    // ==================== ABOUT ====================
    case 'about':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM about WHERE id=1")->fetch());
        }
        if ($method === 'POST') {
            requireAuth();
            $fields = ['texte_principal','texte_secondaire','nom','localisation','disponibilite','email'];
            $sets = []; $params = [];
            foreach ($fields as $f) {
                if (array_key_exists($f, $body)) { $sets[] = "$f=:$f"; $params[":$f"] = $body[$f]; }
            }
            if (!empty($_FILES['photo']['tmp_name'])) {
                $url = uploadImage($_FILES['photo'], 'about');
                if ($url) { $sets[] = "photo=:photo"; $params[':photo'] = $url; }
            }
            if ($sets) $db->prepare("UPDATE about SET " . implode(',', $sets) . " WHERE id=1")->execute($params);
            jsonSuccess($db->query("SELECT * FROM about WHERE id=1")->fetch(), 'About mis à jour');
        }
        break;

    // ==================== SKILLS ====================
    case 'skills':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM skills ORDER BY categorie, ordre")->fetchAll());
        }
        if ($method === 'POST') {
            requireAuth();
            $action = $body['action'] ?? 'create';
            if ($action === 'create') {
                $stmt = $db->prepare("INSERT INTO skills (nom,icone,niveau,categorie,ordre) VALUES (:nom,:icone,:niveau,:categorie,:ordre)");
                $stmt->execute([':nom'=>$body['nom'],':icone'=>$body['icone']??'fas fa-code',':niveau'=>$body['niveau']??80,':categorie'=>$body['categorie']??'Frontend',':ordre'=>$body['ordre']??0]);
                jsonSuccess(['id'=>$db->lastInsertId()], 'Compétence ajoutée', 201);
            }
            if ($action === 'update') {
                $stmt = $db->prepare("UPDATE skills SET nom=:nom,icone=:icone,niveau=:niveau,categorie=:categorie,ordre=:ordre WHERE id=:id");
                $stmt->execute([':nom'=>$body['nom'],':icone'=>$body['icone'],':niveau'=>$body['niveau'],':categorie'=>$body['categorie'],':ordre'=>$body['ordre'],':id'=>$body['id']]);
                jsonSuccess(null, 'Compétence mise à jour');
            }
            if ($action === 'delete') {
                $db->prepare("DELETE FROM skills WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'Compétence supprimée');
            }
        }
        break;

    // ==================== PROJECTS ====================
    case 'projects':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM projects ORDER BY ordre")->fetchAll());
        }
        if ($method === 'POST') {
            requireAuth();
            $action   = $body['action'] ?? 'create';
            $imageUrl = $body['image'] ?? '';
            if (!empty($_FILES['image']['tmp_name'])) {
                $url = uploadImage($_FILES['image'], 'project');
                if ($url) $imageUrl = $url;
            }
            if ($action === 'create') {
                $stmt = $db->prepare("INSERT INTO projects (titre,description,image,lien_demo,lien_github,technologies,features,categorie,featured,ordre) VALUES (:titre,:description,:image,:lien_demo,:lien_github,:technologies,:features,:categorie,:featured,:ordre)");
                $stmt->execute([':titre'=>$body['titre'],':description'=>$body['description']??'',':image'=>$imageUrl,':lien_demo'=>$body['lien_demo']??'#',':lien_github'=>$body['lien_github']??'#',':technologies'=>$body['technologies']??'',':features'=>$body['features']??'',':categorie'=>$body['categorie']??'Web',':featured'=>$body['featured']??0,':ordre'=>$body['ordre']??0]);
                jsonSuccess(['id'=>$db->lastInsertId()], 'Projet ajouté', 201);
            }
            if ($action === 'update') {
                $stmt = $db->prepare("UPDATE projects SET titre=:titre,description=:description,image=:image,lien_demo=:lien_demo,lien_github=:lien_github,technologies=:technologies,features=:features,categorie=:categorie,featured=:featured,ordre=:ordre WHERE id=:id");
                $stmt->execute([':titre'=>$body['titre'],':description'=>$body['description'],':image'=>$imageUrl,':lien_demo'=>$body['lien_demo'],':lien_github'=>$body['lien_github'],':technologies'=>$body['technologies'],':features'=>$body['features'],':categorie'=>$body['categorie'],':featured'=>$body['featured']??0,':ordre'=>$body['ordre']??0,':id'=>$body['id']]);
                jsonSuccess(null, 'Projet mis à jour');
            }
            if ($action === 'delete') {
                $db->prepare("DELETE FROM projects WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'Projet supprimé');
            }
        }
        break;

    // ==================== SERVICES ====================
    case 'services':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM services ORDER BY ordre")->fetchAll());
        }
        if ($method === 'POST') {
            requireAuth();
            $action = $body['action'] ?? 'create';
            if ($action === 'create') {
                $stmt = $db->prepare("INSERT INTO services (titre,icone,prix,features,featured,lien_detail,ordre) VALUES (:titre,:icone,:prix,:features,:featured,:lien_detail,:ordre)");
                $stmt->execute([':titre'=>$body['titre'],':icone'=>$body['icone']??'fas fa-code',':prix'=>$body['prix']??'Sur Devis',':features'=>$body['features']??'',':featured'=>$body['featured']??0,':lien_detail'=>$body['lien_detail']??'#',':ordre'=>$body['ordre']??0]);
                jsonSuccess(['id'=>$db->lastInsertId()], 'Service ajouté', 201);
            }
            if ($action === 'update') {
                $stmt = $db->prepare("UPDATE services SET titre=:titre,icone=:icone,prix=:prix,features=:features,featured=:featured,lien_detail=:lien_detail,ordre=:ordre WHERE id=:id");
                $stmt->execute([':titre'=>$body['titre'],':icone'=>$body['icone'],':prix'=>$body['prix'],':features'=>$body['features'],':featured'=>$body['featured']??0,':lien_detail'=>$body['lien_detail'],':ordre'=>$body['ordre']??0,':id'=>$body['id']]);
                jsonSuccess(null, 'Service mis à jour');
            }
            if ($action === 'delete') {
                $db->prepare("DELETE FROM services WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'Service supprimé');
            }
        }
        break;

    // ==================== FAQ ====================
    case 'faq':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM faq ORDER BY ordre")->fetchAll());
        }
        if ($method === 'POST') {
            requireAuth();
            $action = $body['action'] ?? 'create';
            if ($action === 'create') {
                $stmt = $db->prepare("INSERT INTO faq (question,reponse,icone,ordre) VALUES (:question,:reponse,:icone,:ordre)");
                $stmt->execute([':question'=>$body['question'],':reponse'=>$body['reponse'],':icone'=>$body['icone']??'fas fa-question-circle',':ordre'=>$body['ordre']??0]);
                jsonSuccess(['id'=>$db->lastInsertId()], 'FAQ ajoutée', 201);
            }
            if ($action === 'update') {
                $stmt = $db->prepare("UPDATE faq SET question=:question,reponse=:reponse,icone=:icone,ordre=:ordre WHERE id=:id");
                $stmt->execute([':question'=>$body['question'],':reponse'=>$body['reponse'],':icone'=>$body['icone'],':ordre'=>$body['ordre']??0,':id'=>$body['id']]);
                jsonSuccess(null, 'FAQ mise à jour');
            }
            if ($action === 'delete') {
                $db->prepare("DELETE FROM faq WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'FAQ supprimée');
            }
        }
        break;

    // ==================== CONTACT ====================
    case 'contact':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM contact_info WHERE id=1")->fetch());
        }
        if ($method === 'POST') {
            requireAuth();
            $fields = ['email','telephone','whatsapp','localisation','github','linkedin','facebook'];
            $sets = []; $params = [];
            foreach ($fields as $f) {
                if (array_key_exists($f, $body)) { $sets[] = "$f=:$f"; $params[":$f"] = $body[$f]; }
            }
            if ($sets) $db->prepare("UPDATE contact_info SET " . implode(',', $sets) . " WHERE id=1")->execute($params);
            jsonSuccess(null, 'Contact mis à jour');
        }
        break;

    // ==================== THEME ====================
    case 'theme':
        $db = getDB();
        if ($method === 'GET') {
            jsonSuccess($db->query("SELECT * FROM theme WHERE id=1")->fetch());
        }
        if ($method === 'POST') {
            requireAuth();
            $fields = ['couleur_primaire','couleur_secondaire','couleur_accent','couleur_fond_dark','couleur_fond_light','couleur_texte_dark','couleur_texte_light','police_principale','police_code'];
            $sets = []; $params = [];
            foreach ($fields as $f) {
                if (array_key_exists($f, $body)) { $sets[] = "$f=:$f"; $params[":$f"] = $body[$f]; }
            }
            if ($sets) $db->prepare("UPDATE theme SET " . implode(',', $sets) . " WHERE id=1")->execute($params);
            jsonSuccess(null, 'Thème mis à jour');
        }
        break;

    // ==================== MESSAGES ====================
    case 'messages':
        $db = getDB();
        if ($method === 'GET') {
            requireAuth();
            jsonSuccess($db->query("SELECT * FROM messages ORDER BY created_at DESC")->fetchAll());
        }
        if ($method === 'POST') {
            // Message public (formulaire de contact) — pas de auth
            if (empty($_GET['auth'])) {
                $stmt = $db->prepare("INSERT INTO messages (nom,email,sujet,message) VALUES (:nom,:email,:sujet,:message)");
                $stmt->execute([':nom'=>$body['nom']??'',':email'=>$body['email']??'',':sujet'=>$body['sujet']??'',':message'=>$body['message']??'']);
                jsonSuccess(null, 'Message envoyé avec succès', 201);
            }
            // Actions admin (mark_read / delete)
            requireAuth();
            $action = $body['action'] ?? '';
            if ($action === 'mark_read') {
                $db->prepare("UPDATE messages SET lu=1 WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'Marqué comme lu');
            }
            if ($action === 'delete') {
                $db->prepare("DELETE FROM messages WHERE id=:id")->execute([':id'=>$body['id']]);
                jsonSuccess(null, 'Message supprimé');
            }
        }
        break;

    // ==================== CHANGE PASSWORD ====================
    case 'change-password':
        if ($method === 'POST') {
            $payload = requireAuth();
            $db      = getDB();
            $current = $body['current_password'] ?? '';
            $new     = $body['new_password'] ?? '';
            if (strlen($new) < 6) jsonError('Le nouveau mot de passe doit faire au moins 6 caractères');
            $stmt = $db->prepare("SELECT * FROM admin_users WHERE id=:id");
            $stmt->execute([':id' => $payload['id']]);
            $user = $stmt->fetch();
            if (!$user || !password_verify($current, $user['password'])) {
                jsonError('Mot de passe actuel incorrect');
            }
            $db->prepare("UPDATE admin_users SET password=:p WHERE id=:id")
               ->execute([':p' => password_hash($new, PASSWORD_DEFAULT), ':id' => $payload['id']]);
            jsonSuccess(null, 'Mot de passe modifié');
        }
        break;

    default:
        jsonError('Section inconnue: ' . $section, 404);
}
