#!/usr/bin/env python3
"""
Script pour nettoyer le CMS en supprimant les commentaires excessifs et lignes vides
"""

def nettoyer_cms(fichier_entree, fichier_sortie):
    with open(fichier_entree, 'r', encoding='utf-8') as f:
        lignes = f.readlines()
    
    lignes_nettoyees = []
    ligne_vide_precedente = False
    
    for ligne in lignes:
        ligne_stripped = ligne.strip()
        
        # Ignorer les commentaires JavaScript simples (garder les commentaires HTML)
        if ligne_stripped.startswith('//') and not ligne_stripped.startswith('<!--'):
            # Garder seulement les commentaires de section importants
            if any(mot in ligne_stripped.lower() for mot in ['section', 'fonction', 'gestion', 'variables globales', 'initialisation']):
                lignes_nettoyees.append(ligne)
            continue
        
        # Gérer les lignes vides (max 1 consécutive)
        if ligne_stripped == '':
            if not ligne_vide_precedente:
                lignes_nettoyees.append(ligne)
                ligne_vide_precedente = True
            continue
        else:
            ligne_vide_precedente = False
            lignes_nettoyees.append(ligne)
    
    # Écrire le fichier nettoyé
    with open(fichier_sortie, 'w', encoding='utf-8') as f:
        f.writelines(lignes_nettoyees)
    
    print(f"✅ Nettoyage terminé !")
    print(f"📊 Lignes originales: {len(lignes)}")
    print(f"📊 Lignes nettoyées: {len(lignes_nettoyees)}")
    print(f"🗑️ Lignes supprimées: {len(lignes) - len(lignes_nettoyees)}")

if __name__ == "__main__":
    nettoyer_cms('cms.html', 'cms-propre.html')
