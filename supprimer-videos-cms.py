#!/usr/bin/env python3
"""
Script pour supprimer complètement l'intégration vidéos du CMS
"""

def supprimer_videos_cms(fichier_entree, fichier_sortie):
    with open(fichier_entree, 'r', encoding='utf-8') as f:
        contenu = f.read()
    
    # Supprimer les fonctions JavaScript liées aux vidéos
    fonctions_a_supprimer = [
        'updateVideoFields',
        'generateVideoEmbed',
        'exportVideosToPage'
    ]
    
    lignes = contenu.split('\n')
    lignes_nettoyees = []
    ignorer_bloc = False
    niveau_accolades = 0
    
    i = 0
    while i < len(lignes):
        ligne = lignes[i]
        ligne_stripped = ligne.strip()
        
        # Détecter le début d'une fonction à supprimer
        if any(f'function {func}(' in ligne for func in fonctions_a_supprimer):
            ignorer_bloc = True
            niveau_accolades = 0
            i += 1
            continue
        
        # Si on ignore un bloc, compter les accolades
        if ignorer_bloc:
            niveau_accolades += ligne.count('{')
            niveau_accolades -= ligne.count('}')
            
            # Si on revient à 0, on a fini la fonction
            if niveau_accolades <= 0:
                ignorer_bloc = False
            i += 1
            continue
        
        # Supprimer les références aux vidéos dans createArticle
        if 'videoPlatform:' in ligne or 'videoUrl:' in ligne or 'videoEmbed:' in ligne or 'videoDuration:' in ligne or 'videoTags:' in ligne:
            i += 1
            continue
        
        # Supprimer les validations vidéo
        if 'article.category === \'videos\'' in ligne:
            # Ignorer tout le bloc de validation vidéo
            while i < len(lignes) and '}' not in lignes[i]:
                i += 1
            if i < len(lignes):
                i += 1  # Ignorer aussi la ligne avec }
            continue
        
        # Supprimer les références aux vidéos dans updatePreview
        if 'videoPlatform' in ligne or 'videoUrl' in ligne or 'videoEmbed' in ligne or 'videoDuration' in ligne or 'videoTags' in ligne:
            i += 1
            continue
        
        # Supprimer le bloc d'aperçu vidéo dans updatePreview
        if 'Aperçu vidéo' in ligne:
            # Ignorer tout le bloc d'aperçu vidéo
            while i < len(lignes) and '}' not in lignes[i]:
                i += 1
            if i < len(lignes):
                i += 1
            continue
        
        # Supprimer la catégorie 'videos' de getCategoryName
        if "'videos': 'Vidéos'" in ligne:
            i += 1
            continue
        
        # Supprimer l'event listener pour updateVideoFields
        if 'updateVideoFields' in ligne:
            i += 1
            continue
        
        # Garder la ligne
        lignes_nettoyees.append(ligne)
        i += 1
    
    # Reconstituer le contenu
    contenu_nettoye = '\n'.join(lignes_nettoyees)
    
    # Nettoyer les lignes vides multiples
    import re
    contenu_nettoye = re.sub(r'\n\s*\n\s*\n', '\n\n', contenu_nettoye)
    
    # Écrire le fichier nettoyé
    with open(fichier_sortie, 'w', encoding='utf-8') as f:
        f.write(contenu_nettoye)
    
    print(f"✅ Suppression des vidéos terminée !")
    print(f"📊 Taille originale: {len(contenu.split())} mots")
    print(f"📊 Taille nettoyée: {len(contenu_nettoye.split())} mots")
    print(f"🗑️ Mots supprimés: {len(contenu.split()) - len(contenu_nettoye.split())}")

if __name__ == "__main__":
    supprimer_videos_cms('cms.html', 'cms-sans-videos.html')
