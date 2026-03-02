// Utility Function - Convertir sélection de capteurs en masque binaire
// À utiliser dans les scripts Vijeo pour calculer les masques automatiquement

//================================================================
// Fonction: CapteursToBitmask
// Description: Convertit un tableau de booléens (cases cochées) en masque binaire
// Input: 9 paramètres booléens (C1 à C9)
// Output: INT = masque binaire
//================================================================

function CapteursToBitmask(c1, c2, c3, c4, c5, c6, c7, c8, c9) {
	int mask = 0;

	if(c1) mask += 1;      // Bit 0 = C1
	if(c2) mask += 2;      // Bit 1 = C2
	if(c3) mask += 4;      // Bit 2 = C3
	if(c4) mask += 8;      // Bit 3 = C4
	if(c5) mask += 16;     // Bit 4 = C5
	if(c6) mask += 32;     // Bit 5 = C6
	if(c7) mask += 64;     // Bit 6 = C7
	if(c8) mask += 128;    // Bit 7 = C8
	if(c9) mask += 256;    // Bit 8 = C9

	return mask;
}

//================================================================
// Tables de conversion rapide
//================================================================

// Référence rapide : Masques prédéfinis courants

/*
Tous les capteurs (C1-C9) :
mask = 511 (0x1FF)

Premiers 4 capteurs (C1-C4) :
mask = 15 (0x0F)

Premiers 5 capteurs (C1-C5) :
mask = 31 (0x1F)

Premiers 6 capteurs (C1-C6) :
mask = 63 (0x3F)

Premiers 7 capteurs (C1-C7) :
mask = 127 (0x7F)

Premiers 8 capteurs (C1-C8) :
mask = 255 (0xFF)

Capteurs impairs (C1, C3, C5, C7, C9) :
mask = 273 (0x111)

Capteurs pairs (C2, C4, C6, C8) :
mask = 170 (0xAA)

Capteurs doubles (C1+C2) :
mask = 3 (0x03)

*/

//================================================================
// Exemple d'utilisation dans un script Vijeo
//================================================================

/*
// Supposons que vous ayez 9 variables booléennes (CheckBox) :
// XBT_C1_Enabled, XBT_C2_Enabled, ... XBT_C9_Enabled

int maskNormal = CapteursToBitmask(
	XBT_C1_Enabled.getIntValue(),
	XBT_C2_Enabled.getIntValue(),
	XBT_C3_Enabled.getIntValue(),
	XBT_C4_Enabled.getIntValue(),
	XBT_C5_Enabled.getIntValue(),
	XBT_C6_Enabled.getIntValue(),
	XBT_C7_Enabled.getIntValue(),
	XBT_C8_Enabled.getIntValue(),
	XBT_C9_Enabled.getIntValue()
);

// Sauvegarder le masque
_Reference.Reference_CapteursMask_Normal.write(maskNormal);

// Afficher le masque pour validation (optionnel)
XBT_MaskDisplay.write(maskNormal);
*/

//================================================================
// Fonction inverse : Extraire l'état des capteurs à partir du masque
// (Utile pour l'affichage lors du chargement d'une recette)
//================================================================

function BitmaskToCapteurs(mask) {
	// Retourne un array de 9 booléens
	boolean capteurs[9];

	capteurs[0] = (mask & 1) != 0;      // C1
	capteurs[1] = (mask & 2) != 0;      // C2
	capteurs[2] = (mask & 4) != 0;      // C3
	capteurs[3] = (mask & 8) != 0;      // C4
	capteurs[4] = (mask & 16) != 0;     // C5
	capteurs[5] = (mask & 32) != 0;     // C6
	capteurs[6] = (mask & 64) != 0;     // C7
	capteurs[7] = (mask & 128) != 0;    // C8
	capteurs[8] = (mask & 256) != 0;    // C9

	return capteurs;
}

/*
// Exemple d'utilisation:
boolean[] etatsCapteurs = BitmaskToCapteurs(maskNormal);

// Afficher/définir les cases à cocher
XBT_C1_Enabled.write(etatsCapteurs[0]);
XBT_C2_Enabled.write(etatsCapteurs[1]);
... etc
*/

//================================================================
// Table de décision - Quelle combinaison de capteurs choisir ?
//================================================================

/*
Cas Use Case 1: Contrôle basique (2 capteurs)
- Capteurs disponibles: C1, C2
- Masque = 3 (0x03)

Cas Use Case 2: Contrôle avancé (5 capteurs)
- Capteurs disponibles: C1, C2, C3, C4, C5
- Masque = 31 (0x1F)

Cas Use Case 3: Contrôle partiel (capteurs non consécutifs)
- Capteurs disponibles: C1, C3, C5 (ignorer C2, C4)
- Masque = 21 (0x15 = 0b00010101)

Cas Use Case 4: Contrôle par position (derniers capteurs)
- Capteurs disponibles: C7, C8, C9 (ignorer C1-C6)
- Masque = 448 (0x1C0 = 0b111000000)
*/
