//-------------------------------------
//Script créé : Oct 21, 2025 - MODIFIÉ
//
// Description : Changement de recettes avec gestion des masques de capteurs
//
//-------------------------------------

boolean erreur;

erreur = false;


//********************************************************
// Vérification si le nombre de pièces par U.C. est rempli
//********************************************************
if( _Reference.Reference_NbPcesParUc.getIntValue() == 0)
{
	NumErreurParametres.write(1);
	erreur = true;
}

// Vérification si le nombre de lits ou de bacs est rempli
if( _Reference.Reference_NbLitsBacs.getIntValue() == 0)
{
	NumErreurParametres.write(2);
	erreur = true;
}

//********************************************************
// Vérification du lieu de contrôle pièce
//********************************************************
if(_Reference.Reference_LieuCtrlPiece.getIntValue() == 0)
{
	NumErreurParametres.write(3);
	erreur = true;
}

//********************************************************
// Vérification du remplissage du paramètre "Nombre de capteurs dans l'outil contrôle Hors presse"
//si le mode "Hors Presse" est choisi
//********************************************************
if(_Reference.Reference_LieuCtrlPiece.getIntValue() == 2 && _Reference.Reference_NbCaptCtrlHorsPresse.getIntValue() == 0 )
{
	NumErreurParametres.write(4);
	erreur = true;
}
// Reset de la valeur "NbCaptCtrlHorsPresse" si le mode "Hors Presse" n'est pas activée
if(_Reference.Reference_LieuCtrlPiece.getIntValue() != 2)
{
	_Reference.Reference_NbCaptCtrlHorsPresse.write(0);
}

//********************************************************
// Vérification du remplissage du paramètre "Nombre d'insertions' à chaque station si le mode "Sous Presse" est choisi
//********************************************************
if(_Reference.Reference_NbInserts.getIntValue() == 0 )
{
	NumErreurParametres.write(5);
	erreur = true;
}

//********************************************************
// Vérification du type de contrôle
//********************************************************
if(_Reference.Reference_Type_Controle.getIntValue() == 0 )
{
	NumErreurParametres.write(6);
	erreur = true;
}

//********************************************************
// NOUVEAU : Vérification que le masque de capteurs est défini pour le type de contrôle choisi
//********************************************************
int typeCtrl = _Reference.Reference_Type_Controle.getIntValue();

if(typeCtrl == 1 && _Reference.Reference_CapteursMask_Normal.getIntValue() == 0)
{
	NumErreurParametres.write(7);
	erreur = true;
}

if(typeCtrl == 2 && _Reference.Reference_CapteursMask_Double.getIntValue() == 0)
{
	NumErreurParametres.write(8);
	erreur = true;
}

if(typeCtrl == 3 && _Reference.Reference_CapteursMask_Partiel.getIntValue() == 0)
{
	NumErreurParametres.write(9);
	erreur = true;
}

//********************************************************
// Récupérer les données de la recette enregistée pour les mettre dans la version de travail
// Station 1 Ligne 1 à 6 (Insertions)
//********************************************************
StationTemp[1].NumInsert[1].Mask.write(_Reference.Reference_EtatCaptAvantInsert_0.getIntValue());
StationTemp[1].NumInsert[2].Mask.write(_Reference.Reference_EtatCaptAvantInsert_1.getIntValue());
StationTemp[1].NumInsert[3].Mask.write(_Reference.Reference_EtatCaptAvantInsert_2.getIntValue());
StationTemp[1].NumInsert[4].Mask.write(_Reference.Reference_EtatCaptAvantInsert_3.getIntValue());
StationTemp[1].NumInsert[5].Mask.write(_Reference.Reference_EtatCaptAvantInsert_4.getIntValue());
StationTemp[1].NumInsert[6].Mask.write(_Reference.Reference_EtatCaptAvantInsert_5.getIntValue());

//********************************************************
// Récupérer les masques de capteurs par type de contrôle
//********************************************************
if(typeCtrl == 1)
{
	MasqueCapteursActuel.write(_Reference.Reference_CapteursMask_Normal.getIntValue());
}
else if(typeCtrl == 2)
{
	MasqueCapteursActuel.write(_Reference.Reference_CapteursMask_Double.getIntValue());
}
else if(typeCtrl == 3)
{
	MasqueCapteursActuel.write(_Reference.Reference_CapteursMask_Partiel.getIntValue());
}

//********************************************************
// Affichage du bouton validation paramètres si aucune erreur
//********************************************************
if(erreur)
{
	XBT_AffichageBtnValidParam.write(false);
}
else
{
	XBT_AffichageBtnValidParam.write(true);
	NumErreurParametres.write(0);
}
