# Guide d'implémentation - Mode de contrôle avec capteurs optionnels

## 📋 Résumé des modifications

Cette implémentation permet de définir **dynamiquement quels capteurs sont actifs** selon le type de contrôle choisi. Utile pour les installations où certains capteurs ne sont pas présents ou utilisés.

---

## 🔧 Architecture

### Trois fichiers fournis :

1. **T_Reference_Modified.st** → Nouvelle structure avec 3 masques de capteurs
2. **Gestion_graf_PEM_Modified.st** → Code ST adapté pour utiliser les masques
3. **Script_Changement_de_recettes_Modified.js** → Validation avec masques
4. **Script_Bouton_Validation_Modified.js** → Sauvegarde avec masques

---

## 📌 Étapes d'implémentation

### 1️⃣ Mise à jour de la structure T_Reference

**Ajouter à votre définition de type :**

```st
CapteursMask_Normal   : INT;   (* Capteurs actifs pour Type_Controle = 1 *)
CapteursMask_Double   : INT;   (* Capteurs actifs pour Type_Controle = 2 *)
CapteursMask_Partiel  : INT;   (* Capteurs actifs pour Type_Controle = 3 *)
```

**Représentation binaire :**
- Chaque bit = 1 capteur
- Bit 0 = C1, Bit 1 = C2, ... Bit 8 = C9
- Exemple: 0x1FF (511 décimal) = tous les 9 capteurs
- Exemple: 0x0F (15 décimal) = 4 premiers capteurs (C1-C4)
- Exemple: 0x011 (17 décimal) = C1 et C5 seulement

### 2️⃣ Remplacement du code ST

**Remplacer le fichier** `Gestion graf PEM.st` par `Gestion_graf_PEM_Modified.st`

**Modifications clés :**
- Ajout d'une variable `PEM_Ctrl_Mask` pour stocker le masque actif
- Application du masque avec l'opérateur AND dans les comparaisons
- Nouvelle section pour Type_Controle = 3 (Contrôle Partiel)

**Exemple de logique :**
```st
(* Avant *)
PEM_Ctrl_Ok := (PEM_Ctrl_Etat = PEM_Mask_Positions);

(* Après *)
PEM_Ctrl_Ok := ((PEM_Ctrl_Etat AND PEM_Ctrl_Mask) = (PEM_Mask_Positions AND PEM_Ctrl_Mask));
```

### 3️⃣ Mise à jour des scripts Vijeo

**Remplacer les deux scripts :**
- `Script Changement de recettes.js` → `Script_Changement_de_recettes_Modified.js`
- `Script Bouton Validation.js` → `Script_Bouton_Validation_Modified.js`

**Ajouts dans les scripts :**
- Validation du masque selon le type de contrôle choisi
- Codes d'erreur 7, 8, 9 pour les masques manquants
- Sauvegarde du masque dans la recette

### 4️⃣ Configuration IHM (sur Vijeo)

**À ajouter dans l'écran de configuration :**

Pour chaque type de contrôle, créer une section avec **cases à cocher** pour chaque capteur :

```
Type Contrôle = 1 (Normal)
  □ C1  □ C2  □ C3  □ C4  □ C5  □ C6  □ C7  □ C8  □ C9

Type Contrôle = 2 (Double)
  □ C1  □ C2  □ C3  □ C4  □ C5  □ C6  □ C7  □ C8  □ C9

Type Contrôle = 3 (Partiel)
  □ C1  □ C2  □ C3  □ C4  □ C5  □ C6  □ C7  □ C8  □ C9
```

**Calcul du masque binaire :** Chaque case cochée = bit à 1
- Exemple: C1, C2, C4 cochés = 0b00001101 = 13 décimal

---

## 🧪 Exemple pratique

### Scénario : Installation avec capteurs partiels

- **Type Contrôle 1 (Normal)** : Utilise C1, C2, C3, C4, C5
  - Masque = 0x1F (31 décimal = 0b00011111)

- **Type Contrôle 2 (Double)** : Utilise C1, C2, C3, C4, C5
  - Masque = 0x1F (31 décimal)

- **Type Contrôle 3 (Partiel)** : Utilise seulement C1, C2, C3
  - Masque = 0x07 (7 décimal = 0b00000111)

### Vérification au contrôle :

Pour Type Contrôle 3 avec masque 0x07 :
```
État des capteurs: 0110 0000 (C2=1, C3=0, autres=0)
Masque appliqué:   0000 0111 (C1, C2, C3)

Résultat après AND: 0000 0110 (on ne voit que C2)
Comparaison uniquement sur C1, C2, C3 → ignorant C4-C9
```

---

## ⚠️ Points importants

1. **Ne pas utiliser de masque à 0** → Produit une erreur
2. **Les capteurs ignorés (bit=0) sont filtrés** avant la comparaison
3. **Le changement de type de contrôle** charge le masque approprié
4. **Compatible avec tous les lieux de contrôle** (Hors presse, Sous presse, Sans contrôle)

---

## 🔗 Codes d'erreur Vijeo

| Code | Erreur |
|------|--------|
| 1 | NbPcesParUc non rempli |
| 2 | NbLitsBacs non rempli |
| 3 | LieuCtrlPiece non rempli |
| 4 | NbCaptCtrlHorsPresse manquant |
| 5 | NbInserts non rempli |
| 6 | Type_Controle non rempli |
| **7** | **CapteursMask_Normal manquant (Type=1)** |
| **8** | **CapteursMask_Double manquant (Type=2)** |
| **9** | **CapteursMask_Partiel manquant (Type=3)** |

---

## 📝 Checklist d'implémentation

- [ ] Modifier la structure T_Reference
- [ ] Remplacer le code ST par la version modifiée
- [ ] Remplacer les 2 scripts Vijeo
- [ ] Ajouter l'interface de sélection des capteurs dans l'HMI
- [ ] Tester avec Type = 1, 2, 3
- [ ] Vérifier les masques sont bien sauvegardés dans les recettes
- [ ] Tester le contrôle avec capteurs optionnels masqués

---

## 💡 Besoin d'aide ?

Si vous avez besoin d'adapter cette solution pour votre cas spécifique ou de clarifier un point, je suis disponible !
