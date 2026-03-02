//-------------------------------------
//Script créé : May 05, 2023
//
// Description :
//
//-------------------------------------
boolean erreur;
erreur = false;


//-------------------------------------
//Script créé : Feb 15, 2024
//
// Description :
//
//-------------------------------------
int valeur = 0;
// Récupérer les données de la recette enregistée pour les mettre dans la version de travail

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
// Vérification du remplissage du paramètre "Nombre de capteurs dans l'outil contrôle Hors presse" si le mode "Hors Presse" est choisi
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
// Vérification du remplissage du paramètre "Nombre d'insertions'
//********************************************************
if( _Reference.Reference_NbInserts.getIntValue() == 0 )
     
     
{
	NumErreurParametres.write(5);
	erreur = true;
}

if( _Reference.Reference_Type_Controle.getIntValue() == 0 )
      
{
	NumErreurParametres.write(6);
	erreur = true;
}

//********************************************************
// Gestion de l'enregistrement des états capteurs attendus pour chaque insertion
//********************************************************

	
// Enregistrement des données dans la recette
_Reference.Reference_EtatCaptAvantInsert_0.write(StationTemp[1].NumInsert[1].Mask.getIntValue());
_Reference.Reference_EtatCaptAvantInsert_1.write(StationTemp[1].NumInsert[2].Mask.getIntValue());
_Reference.Reference_EtatCaptAvantInsert_2.write(StationTemp[1].NumInsert[3].Mask.getIntValue());
_Reference.Reference_EtatCaptAvantInsert_3.write(StationTemp[1].NumInsert[4].Mask.getIntValue());
_Reference.Reference_EtatCaptAvantInsert_4.write(StationTemp[1].NumInsert[5].Mask.getIntValue());
_Reference.Reference_EtatCaptAvantInsert_5.write(StationTemp[1].NumInsert[6].Mask.getIntValue());


//********************************************************
// Gestion de l'enregistrement des états capteurs attendus pour chaque pièces types
//********************************************************
_Reference.Reference_ResultatsPT_0.write(PiecesTypesTemp[1].Mask.getIntValue());
_Reference.Reference_ResultatsPT_1.write(PiecesTypesTemp[2].Mask.getIntValue());
_Reference.Reference_ResultatsPT_2.write(PiecesTypesTemp[3].Mask.getIntValue());
_Reference.Reference_ResultatsPT_3.write(PiecesTypesTemp[4].Mask.getIntValue());
_Reference.Reference_ResultatsPT_4.write(PiecesTypesTemp[5].Mask.getIntValue());
_Reference.Reference_ResultatsPT_5.write(PiecesTypesTemp[6].Mask.getIntValue());


//********************************************************
// Gestion de l'enregistrement de l'état des capteurs pour le contrôle partiel
//********************************************************
// si le contrôle est partiel on passe par la valeur choisie dans l'IHM
if (_Reference.Reference_Type_Controle.getIntValue() == 4 )
{
     _Reference.Reference_Mask_Positions.write(Mask_Temp.Mask.getIntValue());
     
// sinon on prend celle de l'automate
} else {
	
	_Reference.Reference_Mask_Positions.write(Reference.Mask_Positions.getIntValue());
	
}
if(_Reference.Reference_Type_Controle.getIntValue() != 1  &&  _Reference.Reference_LieuCtrlPiece.getIntValue() == 1 ) 
{
	_Reference.Reference_Type_Controle.write(1) ;
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