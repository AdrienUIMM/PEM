	(* Gestion PEM *)



	(* GESTION DES CAPTEURS POSTE CTRL ET CODAGE *)
	IF XBT1_reference=100 THEN (* SAUT*)

	(* lecture codage CTRL *)
	PEM_Lect_Codage.0:=PEM_Codage1;
	PEM_Lect_Codage.1:=PEM_Codage2;
	PEM_Lect_Codage.2:=PEM_Codage3;
	PEM_Lect_Codage.3:=PEM_Codage4;
	PEM_Lect_Codage.4:=PEM_Codage5;


	IF Reference.Type_Controle = 1 OR Reference.Type_Controle = 4 OR Reference.Type_Controle = 5 OR Reference.Type_Controle = 6 THEN


		IF Reference.Type_Controle = 1 THEN
			PEM_Capteurs_Ctrl:= BIT_TO_WORD(PEM_C1,PEM_C2,PEM_C3,
					PEM_C4,PEM_C5,PEM_C6,
					PEM_C7,PEM_C8,PEM_C9);(* lecture capteurs de Controle et de position *)	
		END_IF ; 

					
		(*Bits de Ctrl Double*)
		PEM_Ctrl_double:=FALSE;
		PEM_Xbt_aff_Ctrl_double:=FALSE;
		PEM_Ctrl1_Ok:=FALSE;
		PEM_Ctrl2_Ok:=FALSE;

		(*Gestion Contrôle détrompage *)
		PEM_Ctrl_Detrompage_OK:=FALSE;
		PEM_Ctrl_Detrompage_Repos:=FALSE;
		PEM_Ctrl_Detrompage_Util:=FALSE;
		
		(*SANS CONTROLE *)
		IF Reference.LieuCtrlPiece = 1 THEN
		
			PEM_Ctrl_Repos:= FALSE; 

		END_IF ; 

		(*AVEC CONTROLE HORS PRESSE *)
		IF Reference.LieuCtrlPiece = 2 THEN
			(* Si aucune demande de passage de pièces types *)
			IF NOT PEM_DmdPassagePT then 

				PEM_Mask_Positions:= INT_TO_WORD(REAL_TO_INT(EXPT_REAL ( 2.0, Reference.NbCaptCtrlHorsPresse))-1);

				(* on garde uniquement les capteurs de Controle *)
				PEM_Ctrl_Etat:=PEM_Capteurs_Ctrl AND PEM_Mask_Positions;
	
				IF Reference.Type_Controle = 5 or Reference.Type_Controle = 6 THEN

					IF XPEM_CTRL2.x OR XPEM_PD3.x THEN
						PEM_Ctrl_Repos := FALSE ;
					ELSE
						PEM_Ctrl_Repos := TRUE ;
					END_IF ; 
				ELSE
					(* aucun capteur activé : Ctrl au repos *)
					PEM_Ctrl_Repos:=(PEM_Ctrl_Etat=0); 
				END_IF;

				(* aucun capteur activé : Ctrl au repos *)
				PEM_Ctrl_Repos:=(PEM_Ctrl_Etat=0); 

				(* Position pièce OK *)
				PEM_Ctrl_Ok:=(PEM_Ctrl_Etat=PEM_Mask_Positions); 

			ELSE

				(* GESTION DU PASSAGE DES PIECES TYPES *)
				(* Incrémentation et raz du compteur pièces types *)
				if NOT XPEM_PT4.X and IncrNumPT THEN 

					INC(PEM_numPT); 
					IncrNumPT := false; 

				end_if;

				if XPEM_PT4.X THEN 

					IncrNumPT := true; 

				END_IF;
				
				(* Récupération du masque à appliquer pour contrôler la pièce type *)
				PEM_Mask_Positions := INT_TO_WORD(Reference.ResultatsPT[PEM_numPT]);

				(* on garde uniquement les capteurs de Controle *)
				PEM_Ctrl_Etat := PEM_Capteurs_Ctrl ;
			
				(* aucun capteur activé : Ctrl au repos *)
				PEM_Ctrl_Repos := (PEM_Capteurs_Ctrl=0); 

				(* Controle OK *)
				PEM_Ctrl_Ok := (PEM_Ctrl_Etat = PEM_Mask_Positions); 
			END_IF;

			(* RAZ compteur pièces types *)
			IF XPEM_PT0.X THEN 

				PEM_NumPT := 1; 

			END_IF;
		END_IF;

		(* CONTROLE POSITIONNEMENT SOUS PRESSE *)
		IF Reference.LieuCtrlPiece = 3 THEN

			(* Si aucune demande de passage de pièces types *)
			IF NOT PEM_DmdPassagePT then 
				(* Récupération du masque à appliquer au contrôle 100 % *)
				PEM_Mask_Positions := INT_TO_WORD(Reference.EtatCaptAvantInsert[NumInsert_A_Poser]);

				(* on garde uniquement les capteurs de Controle *)
				PEM_Ctrl_Etat := PEM_Capteurs_Ctrl ;
			
				(* aucun capteur activé : Ctrl au repos *)
				PEM_Ctrl_Repos := (PEM_Capteurs_Ctrl=0); 

				(* Controle OK *)
				PEM_Ctrl_Ok:= (PEM_Ctrl_Etat=PEM_Mask_Positions); 
				
			ELSE

			(* GESTION DU PASSAGE DES PIECES TYPES *)
				(* Incrémentation et raz du compteur pièces types *)
				IF NOT XPEM_PT4.X and IncrNumPT THEN 

				INC(PEM_numPT); 
				IncrNumPT := 0; 

				END_IF;

				if XPEM_PT4.X THEN 
				IncrNumPT := 1; 
				END_IF;
				

				(* Récupération du masque à appliquer pour contrôler la pièce type *)
				PEM_Mask_Positions := INT_TO_WORD(Reference.ResultatsPT[PEM_numPT]);

				(* on garde uniquement les capteurs de Controle *)
				PEM_Ctrl_Etat := PEM_Capteurs_Ctrl ;
			
				(* aucun capteur activé : Ctrl au repos *)
				PEM_Ctrl_Repos := (PEM_Capteurs_Ctrl=0); 

				(* Controle OK *)
				PEM_Ctrl_Ok := (PEM_Ctrl_Etat=PEM_Mask_Positions); 
			END_IF;

			(* RAZ compteur pièces types *)
			IF XPEM_PT0.X THEN 

				PEM_NumPT := 1; 

			END_IF;

		END_IF;



	END_IF;

	

	(*O3928 : Contrôle Double*)
	IF Reference.Type_Controle = 2 THEN
		
		PEM_Ctrl_double:=TRUE;
		PEM_Ctrl_Etat:=0;
		PEM_Ctrl_Repos:=NOT PEM_C1 AND NOT PEM_C2 AND NOT PEM_C3 AND NOT PEM_C4;(* aucun capteur activé : Ctrl au repos *)
		PEM_Ctrl_Ok:=PEM_Ctrl1_Ok AND PEM_Ctrl2_Ok;(* Controle OK *)
		PEM_Pcs_En_Pos_OK:=TRUE;(* pas de controle de position *)

		(*Gestion Contrôle détrompage *)
		PEM_Ctrl_Detrompage_OK:=FALSE;
		PEM_Ctrl_Detrompage_Repos:=FALSE;
		PEM_Ctrl_Detrompage_Util:=FALSE;
		
		(* INIALISATION PRODUCTION AVEC CONTROLE *)
		IF XGENPEM5.X THEN
			
			PEM_Mask_Positions:=0;(* masque des positions *)
			PEM_Util_Pos:=0;
			PEM_Ref_Prod_Ok:=1;
		END_IF;
		
		(* Gestion spéciale ctrl en 2 fois *)
		IF XPEM_CTRL3.X OR XPEM_CTRL4.X THEN
			PEM_Xbt_aff_Ctrl_double:=TRUE;
			IF PEM_C1 AND PEM_C2 AND PEM_C3 AND NOT PEM_C4 AND NOT PEM_C5 THEN
				PEM_Ctrl1_Ok:=TRUE;
			END_IF;

			IF NOT PEM_C1 AND NOT PEM_C2 AND NOT PEM_C3 AND PEM_C4 AND PEM_C5 THEN
				PEM_Ctrl2_Ok:=TRUE;
			END_IF;
		ELSIF XPEM_PT2.X OR XPEM_PT4.X OR XPEM_PT5.X THEN
			PEM_Xbt_aff_Ctrl_double:=TRUE;
			TON_Ctrl_1_ok_pt (IN := ((PEM_C1 AND PEM_C2 AND PEM_C3) 
			AND (NOT PEM_C4 AND NOT PEM_C5)),
					PT := T#1s (*,
					Q => ,
					ET => *)); 

			IF TON_Ctrl_1_ok_pt.Q THEN
				PEM_Ctrl1_Ok:=TRUE;
			END_IF;

			IF NOT PEM_C1 AND NOT PEM_C2 AND NOT PEM_C3 AND PEM_C4 AND PEM_C5 THEN
				PEM_Ctrl2_Ok:=TRUE;
			END_IF;
		ELSE
			PEM_Ctrl1_Ok:=FALSE;
			PEM_Ctrl2_Ok:=FALSE;
			PEM_Xbt_aff_Ctrl_double:=FALSE;
		END_IF;
	END_IF;


	(* GRAFCET GENERAL PEM *)
	(* Etape d'initialisation X0 *)
	If XGENPEM0.x Then

		PEM_Chx_mode_Prod := 0 ;
		XBT1_MsgOperateur:=0;
		PEM_DmdPassagePT:=0;
		PEM_Prod_Encours:=0;
		PEM_Arret_Prod_Encours:=0;
		PEM_Debut_Prod:=0;

		PEM_Ref_Prod_Ok:=0;
		PEM_Xbt_aff_Ctrl_double:=FALSE;
		PEM_Ctrl_double:=FALSE;
		PEM_Ctrl1_Ok:=FALSE;
		PEM_Ctrl2_Ok:=FALSE;
		PEM_Ctrl_Detrompage_OK:=FALSE;
		PEM_Ctrl_Detrompage_Repos:=FALSE;
		PEM_Ctrl_Detrompage_Util:=FALSE;

	END_If;

	If XGENPEM5.x   Then
		PEM_Ref_Prod_Ok:=1;
	END_IF;

	If XGENPEM6.x  Then

		IF PEM_BP_Oui THEN

			PEM_DmdPassagePT:=1;

		END_IF ; 

	END_If;

	If XGENPEM7.x and PEM_BP_Oui_Init Then

		PEM_CptUc := 0 ; 
		PEM_CptBonnes_1:=0;
		PEM_CptBonnes_2:=0;
		PEM_CptMauvaises:=0;
		PEM_CptIntercalaires := 0 ; 

	END_If;


	IF XGENPEM8.X THEN
		
		PEM_Prod_EnCours:=1;


		IF XTR10.X THEN
			PEM_Rang_Termine:=0;
		END_IF;

	(* Gestion des lits*)

	(* ************************************************************ *)
	(*		Poste à trappe : GESTION COMPTAGE		*)
	(* ************************************************************ *)

	IF XGENPEM8.X AND XBT1_reference=100 AND not Portique_branche THEN
			PEM_Prod_Encours:=1;

			IF XTR10.X THEN
				PEM_Rang_Termine:=0;
			END_IF;

		(* Gestion des lits*)
		
			(* INITIALISATION DES COMPTEURS DE PIECES DANS LE BAC *)
			IF Reference.NbLitsBacs >1 THEN
				PEM_Mod_pcs_lit := (Reference.NbPcesParUc * Reference.NbLitsBacs)  MOD Reference.NbLitsBacs;

				IF PEM_Mod_pcs_lit<>0 THEN (* nombre de lit impossible à calculer*)
					Reference.NbLitsBacs:=1; (* remise à zéro du nombre de lit*)
					PEM_xbt_warning_nbr_lit := 1;
				END_IF;

				PEM_Nbr_Pcs_Lit := Reference.NbPcesParUc; 
				PEM_Nbr_Pcs_intercalaire := PEM_Nbr_Pcs_Lit -1; (* l'intercalaire est demandé juste avant d'avoir le nombre de pcs par lit*)
			END_IF;

			IF XTR13.X THEN

				IF Reference.NbLitsBacs > 1  THEN	
					IF (PEM_CptUc +1) = Reference.NbPcesParUc and PEM_CptIntercalaires <= Reference.NbLitsBacs THEN
						IF NOT PEM_Intercalaire THEN
							INC(PEM_CptIntercalaires);
							SET(PEM_Intercalaire );
						END_IF;
					END_IF;
				END_IF;

			END_IF;

			IF XTR13a.X AND PEM_Intercalaire THEN
				PEM_Rang_Termine:=1;
				PEM_Intercalaire:=0;	
			END_IF;

			if XTR16.X and PEM_CptUc = Reference.NbPcesParUc THEN
				PEM_CptUc :=0;
			end_IF;

			if XTR24.X THEN
				PEM_CptIntercalaires :=0;
			END_IF;

			IF (XTR30.X OR XTR31.X) AND PEM_Intercalaire THEN
				PEM_Rang_Termine:=0;
				PEM_Intercalaire:=0;	
				PEM_CptIntercalaires :=0;
			END_IF;
		END_IF;
	END_IF;



	(* GESTION GRAFCET PIECES TYPES *)
	IF XPEM_PT3.X THEN
			PEM_DmdPassagePT:=0;
	END_IF;

	(* GESTION GRAFCET POSE GOUJONS *)
	IF XPEM_GJ0.X THEN

		PEM_NbrGoujons_Poses:=0;
		NumInsert_A_Poser:=1;

	END_IF;
END_IF ; 

