#!/usr/bin/env python3
"""
Script d'extraction des annonces Voursa
Récupère les N dernières annonces de chaque catégorie avec leurs images
"""

import json
import time
import os
import re
import hashlib
from datetime import datetime
from typing import Dict, List, Optional, Tuple
from urllib.parse import urljoin, urlparse
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import logging

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('voursa_scraper.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class VoursaCompleteScraper:
    """Scraper complet pour toutes les catégories de Voursa"""
    
    # Catégories principales du site
    CATEGORIES = {
        'real_estate': 'Immobilier',
        'vehicles': 'Véhicules',
        'electronics': 'Électronique',
        'furniture': 'Meubles',
        'jobs': 'Emplois',
        'services': 'Services',
        'fashion': 'Mode',
        'sports': 'Sports & Loisirs',
        'animals': 'Animaux',
        'others': 'Autres'
    }
    
    def __init__(self, ads_per_category: int = 20, headless: bool = True, 
                 download_images: bool = True, image_quality: str = 'high'):
        """
        Initialise le scraper
        
        Args:
            ads_per_category: Nombre d'annonces à récupérer par catégorie
            headless: Si True, lance Chrome sans interface graphique
            download_images: Si True, télécharge les images des annonces
            image_quality: 'high', 'medium', ou 'thumbnail'
        """
        self.ads_per_category = ads_per_category
        self.download_images = download_images
        self.image_quality = image_quality
        self.base_url = "https://www.voursa.com/EN"
        
        # Configuration de Selenium
        self.options = webdriver.ChromeOptions()
        if headless:
            self.options.add_argument('--headless=new')
        
        # Options pour éviter la détection
        self.options.add_argument('--no-sandbox')
        self.options.add_argument('--disable-dev-shm-usage')
        self.options.add_argument('--disable-blink-features=AutomationControlled')
        self.options.add_experimental_option("excludeSwitches", ["enable-automation"])
        self.options.add_experimental_option('useAutomationExtension', False)
        self.options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
        
        # Initialiser le driver
        service = Service(ChromeDriverManager().install())
        self.driver = webdriver.Chrome(service=service, options=self.options)
        self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        self.wait = WebDriverWait(self.driver, 15)
        
        # Créer les dossiers nécessaires
        self.create_directories()
        
        # Statistiques
        self.stats = {
            'total_ads': 0,
            'total_images': 0,
            'errors': 0,
            'start_time': datetime.now()
        }
    
    def create_directories(self):
        """Crée les dossiers nécessaires pour le stockage"""
        directories = ['data', 'images', 'logs']
        for directory in directories:
            if not os.path.exists(directory):
                os.makedirs(directory)
                logger.info(f"Dossier créé: {directory}")
    
    def get_category_url(self, category_key: str) -> str:
        """Construit l'URL d'une catégorie"""
        return f"{self.base_url}/categories/{category_key}"
    
    def wait_for_page_load(self, timeout: int = 10):
        """Attend que la page soit complètement chargée"""
        try:
            self.wait.until(
                lambda driver: driver.execute_script("return document.readyState") == "complete"
            )
            time.sleep(2)  # Pause supplémentaire pour les éléments dynamiques
        except TimeoutException:
            logger.warning("Timeout lors du chargement de la page")
    
    def extract_ad_urls_from_listing(self, category_url: str, max_ads: int) -> List[str]:
        """
        Extrait les URLs des annonces depuis une page de catégorie
        
        Args:
            category_url: URL de la catégorie
            max_ads: Nombre maximum d'annonces à récupérer
            
        Returns:
            Liste des URLs d'annonces
        """
        ad_urls = []
        page = 1
        
        while len(ad_urls) < max_ads:
            try:
                # Construire l'URL avec pagination
                page_url = f"{category_url}?page={page}" if page > 1 else category_url
                logger.info(f"Scraping page {page}: {page_url}")
                
                self.driver.get(page_url)
                self.wait_for_page_load()
                
                # Chercher les liens des annonces
                # Adapter ces sélecteurs selon la structure réelle du site
                selectors = [
                    "a[href*='/ads/']",
                    ".ad-item a",
                    ".listing-item a",
                    "[class*='ad-link']",
                    "[class*='listing-link']"
                ]
                
                links_found = False
                for selector in selectors:
                    try:
                        elements = self.driver.find_elements(By.CSS_SELECTOR, selector)
                        if elements:
                            for element in elements:
                                href = element.get_attribute('href')
                                if href and '/ads/' in href and href not in ad_urls:
                                    ad_urls.append(href)
                                    links_found = True
                                    
                                    if len(ad_urls) >= max_ads:
                                        return ad_urls[:max_ads]
                            break
                    except:
                        continue
                
                if not links_found:
                    logger.warning(f"Aucune annonce trouvée sur la page {page}")
                    break
                
                # Vérifier s'il y a une page suivante
                try:
                    next_button = self.driver.find_element(By.CSS_SELECTOR, 
                        "a[rel='next'], .pagination-next, [class*='next-page']")
                    if not next_button.is_enabled():
                        break
                except NoSuchElementException:
                    logger.info("Dernière page atteinte")
                    break
                
                page += 1
                time.sleep(2)  # Pause entre les pages
                
            except Exception as e:
                logger.error(f"Erreur lors de l'extraction des URLs page {page}: {e}")
                break
        
        return ad_urls[:max_ads]
    
    def extract_ad_details(self, ad_url: str) -> Dict:
        """
        Extrait tous les détails d'une annonce
        
        Args:
            ad_url: URL de l'annonce
            
        Returns:
            Dictionnaire contenant tous les détails
        """
        ad_data = {
            'url': ad_url,
            'ad_id': self.extract_ad_id(ad_url),
            'scraping_date': datetime.now().isoformat(),
            'title': '',
            'price': '',
            'currency': '',
            'description': '',
            'location': '',
            'category': '',
            'subcategory': '',
            'images': [],
            'details': {},
            'seller': {
                'name': '',
                'phone': '',
                'type': ''  # particulier ou professionnel
            },
            'metadata': {
                'views': 0,
                'posted_date': '',
                'modified_date': ''
            }
        }
        
        try:
            logger.info(f"Extraction des détails: {ad_url}")
            self.driver.get(ad_url)
            self.wait_for_page_load()
            
            # Utiliser BeautifulSoup pour parser
            soup = BeautifulSoup(self.driver.page_source, 'html.parser')
            
            # Titre
            title_selectors = ['h1', '.ad-title', '.title', '[class*="title"]']
            for selector in title_selectors:
                element = soup.select_one(selector)
                if element and element.text.strip():
                    ad_data['title'] = element.text.strip()
                    break
            
            # Prix
            price_selectors = ['.price', '.ad-price', '[class*="price"]']
            for selector in price_selectors:
                element = soup.select_one(selector)
                if element:
                    price_text = element.text.strip()
                    ad_data['price'] = self.extract_price(price_text)
                    ad_data['currency'] = self.extract_currency(price_text)
                    break
            
            # Description
            desc_selectors = ['.description', '.ad-description', '[class*="description"]']
            for selector in desc_selectors:
                element = soup.select_one(selector)
                if element:
                    ad_data['description'] = element.text.strip()
                    break
            
            # Localisation
            location_selectors = ['.location', '.ad-location', '[class*="location"]', 
                                 '[class*="address"]']
            for selector in location_selectors:
                element = soup.select_one(selector)
                if element:
                    ad_data['location'] = element.text.strip()
                    break
            
            # Images
            ad_data['images'] = self.extract_images(soup)
            
            # Détails spécifiques (surface, chambres, année, kilométrage, etc.)
            ad_data['details'] = self.extract_specific_details(soup)
            
            # Informations vendeur
            ad_data['seller'] = self.extract_seller_info(soup)
            
            # Métadonnées
            ad_data['metadata'] = self.extract_metadata(soup)
            
            # Catégorie depuis le breadcrumb ou l'URL
            ad_data['category'] = self.extract_category(soup, ad_url)
            
        except Exception as e:
            logger.error(f"Erreur extraction annonce {ad_url}: {e}")
            self.stats['errors'] += 1
        
        return ad_data
    
    def extract_ad_id(self, url: str) -> str:
        """Extrait l'ID unique de l'annonce depuis l'URL"""
        match = re.search(r'-(\d+)$', url)
        if match:
            return match.group(1)
        return hashlib.md5(url.encode()).hexdigest()[:10]
    
    def extract_price(self, price_text: str) -> str:
        """Extrait le prix numérique du texte"""
        price_match = re.search(r'[\d,.\s]+', price_text)
        if price_match:
            return price_match.group().strip().replace(' ', '').replace(',', '.')
        return price_text
    
    def extract_currency(self, price_text: str) -> str:
        """Extrait la devise du prix"""
        currencies = ['MRU', 'EUR', '$', '€', 'USD']
        for currency in currencies:
            if currency in price_text:
                return currency
        return 'MRU'  # Devise par défaut pour la Mauritanie
    
    def extract_images(self, soup: BeautifulSoup) -> List[Dict]:
        """Extrait toutes les images de l'annonce"""
        images = []
        
        # Sélecteurs pour les images
        img_selectors = [
            '.gallery img',
            '.carousel img', 
            '[class*="gallery"] img',
            '[class*="slider"] img',
            '.ad-images img',
            'img[src*="/uploads/"]',
            'img[src*="/images/"]'
        ]
        
        for selector in img_selectors:
            elements = soup.select(selector)
            for img in elements:
                src = img.get('src') or img.get('data-src')
                if src and not src.endswith('.svg'):
                    # Construire l'URL complète si nécessaire
                    if not src.startswith('http'):
                        src = urljoin(self.base_url, src)
                    
                    images.append({
                        'url': src,
                        'alt': img.get('alt', ''),
                        'title': img.get('title', '')
                    })
        
        # Éliminer les doublons
        seen = set()
        unique_images = []
        for img in images:
            if img['url'] not in seen:
                seen.add(img['url'])
                unique_images.append(img)
        
        return unique_images
    
    def extract_specific_details(self, soup: BeautifulSoup) -> Dict:
        """Extrait les détails spécifiques selon le type d'annonce"""
        details = {}
        
        # Chercher les paires clé-valeur
        detail_selectors = [
            '.detail-item',
            '.property-detail',
            '[class*="detail"]',
            '.specs li',
            '.characteristics li'
        ]
        
        for selector in detail_selectors:
            elements = soup.select(selector)
            for element in elements:
                text = element.text.strip()
                
                # Chercher les patterns clé:valeur
                if ':' in text:
                    key, value = text.split(':', 1)
                    details[self.normalize_key(key.strip())] = value.strip()
                elif '：' in text:  # Deux-points pleine largeur
                    key, value = text.split('：', 1)
                    details[self.normalize_key(key.strip())] = value.strip()
        
        # Chercher des patterns spécifiques
        self.extract_real_estate_details(soup, details)
        self.extract_vehicle_details(soup, details)
        
        return details
    
    def extract_real_estate_details(self, soup: BeautifulSoup, details: Dict):
        """Extrait les détails spécifiques à l'immobilier"""
        patterns = {
            'surface': r'(\d+)\s*m[²2]',
            'rooms': r'(\d+)\s*(?:pièces?|rooms?|chambres?)',
            'bedrooms': r'(\d+)\s*(?:chambres?|bedrooms?)',
            'bathrooms': r'(\d+)\s*(?:salles? de bain|bathrooms?)',
            'floor': r'(\d+)(?:er?|ème)?\s*étage',
            'year': r'(?:année|year|construit?)\s*:?\s*(\d{4})'
        }
        
        text = soup.get_text()
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match and key not in details:
                details[key] = match.group(1)
    
    def extract_vehicle_details(self, soup: BeautifulSoup, details: Dict):
        """Extrait les détails spécifiques aux véhicules"""
        patterns = {
            'mileage': r'(\d+[\d\s]*)\s*(?:km|kilomètres?)',
            'year': r'(?:année|year|modèle)\s*:?\s*(\d{4})',
            'fuel': r'(?:carburant|fuel)\s*:?\s*(diesel|essence|électrique|hybride)',
            'transmission': r'(?:transmission|boîte)\s*:?\s*(manuelle?|automatique?)',
            'power': r'(\d+)\s*(?:cv|ch|hp)'
        }
        
        text = soup.get_text()
        for key, pattern in patterns.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match and key not in details:
                details[key] = match.group(1)
    
    def normalize_key(self, key: str) -> str:
        """Normalise les clés pour uniformiser les données"""
        translations = {
            'superficie': 'surface',
            'pièces': 'rooms',
            'chambres': 'bedrooms',
            'année': 'year',
            'kilométrage': 'mileage',
            'carburant': 'fuel',
            'boîte de vitesse': 'transmission',
            'puissance': 'power',
            'étage': 'floor'
        }
        
        key_lower = key.lower()
        return translations.get(key_lower, key_lower.replace(' ', '_'))
    
    def extract_seller_info(self, soup: BeautifulSoup) -> Dict:
        """Extrait les informations du vendeur"""
        seller = {'name': '', 'phone': '', 'type': ''}
        
        # Nom du vendeur
        name_selectors = ['.seller-name', '.vendor-name', '[class*="seller"]']
        for selector in name_selectors:
            element = soup.select_one(selector)
            if element:
                seller['name'] = element.text.strip()
                break
        
        # Téléphone
        phone_selectors = ['a[href^="tel:"]', '.phone', '[class*="phone"]']
        for selector in phone_selectors:
            element = soup.select_one(selector)
            if element:
                phone = element.text.strip()
                if not phone and element.get('href'):
                    phone = element['href'].replace('tel:', '')
                seller['phone'] = phone
                break
        
        # Type (particulier/professionnel)
        text = soup.get_text().lower()
        if 'professionnel' in text or 'agence' in text:
            seller['type'] = 'professionnel'
        elif 'particulier' in text:
            seller['type'] = 'particulier'
        
        return seller
    
    def extract_metadata(self, soup: BeautifulSoup) -> Dict:
        """Extrait les métadonnées de l'annonce"""
        metadata = {'views': 0, 'posted_date': '', 'modified_date': ''}
        
        # Vues
        views_pattern = r'(\d+)\s*(?:vues?|views?)'
        views_match = re.search(views_pattern, soup.get_text(), re.IGNORECASE)
        if views_match:
            metadata['views'] = int(views_match.group(1))
        
        # Date de publication
        date_selectors = ['.posted-date', '.publish-date', '[class*="date"]']
        for selector in date_selectors:
            element = soup.select_one(selector)
            if element:
                metadata['posted_date'] = element.text.strip()
                break
        
        return metadata
    
    def extract_category(self, soup: BeautifulSoup, url: str) -> str:
        """Extrait la catégorie depuis le breadcrumb ou l'URL"""
        # Depuis le breadcrumb
        breadcrumb = soup.select_one('.breadcrumb, [class*="breadcrumb"]')
        if breadcrumb:
            items = breadcrumb.select('a, span')
            if len(items) > 1:
                return items[1].text.strip()
        
        # Depuis l'URL
        for key, name in self.CATEGORIES.items():
            if f'/categories/{key}' in url:
                return name
        
        return 'Autres'
    
    def download_ad_images(self, ad_data: Dict, folder: str = "images"):
        """
        Télécharge les images d'une annonce
        
        Args:
            ad_data: Données de l'annonce
            folder: Dossier de destination
        """
        if not self.download_images or not ad_data.get('images'):
            return
        
        ad_id = ad_data['ad_id']
        ad_folder = os.path.join(folder, ad_id)
        
        if not os.path.exists(ad_folder):
            os.makedirs(ad_folder)
        
        downloaded = []
        
        for idx, img_data in enumerate(ad_data['images']):
            try:
                img_url = img_data['url']
                
                # Déterminer l'extension
                parsed_url = urlparse(img_url)
                ext = os.path.splitext(parsed_url.path)[1]
                if not ext or ext not in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
                    ext = '.jpg'
                
                filename = f"{ad_id}_{idx:03d}{ext}"
                filepath = os.path.join(ad_folder, filename)
                
                # Télécharger l'image
                response = requests.get(img_url, timeout=10, headers={
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
                
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    
                    img_data['local_path'] = filepath
                    downloaded.append(filepath)
                    self.stats['total_images'] += 1
                    logger.debug(f"Image téléchargée: {filename}")
                
            except Exception as e:
                logger.error(f"Erreur téléchargement image {img_url}: {e}")
        
        return downloaded
    
    def scrape_category(self, category_key: str) -> List[Dict]:
        """
        Scrape toutes les annonces d'une catégorie
        
        Args:
            category_key: Clé de la catégorie
            
        Returns:
            Liste des annonces scrapées
        """
        category_name = self.CATEGORIES.get(category_key, category_key)
        logger.info(f"\n{'='*50}")
        logger.info(f"Scraping catégorie: {category_name}")
        logger.info(f"{'='*50}")
        
        ads = []
        category_url = self.get_category_url(category_key)
        
        # Récupérer les URLs des annonces
        ad_urls = self.extract_ad_urls_from_listing(category_url, self.ads_per_category)
        logger.info(f"Trouvé {len(ad_urls)} annonces dans {category_name}")
        
        # Extraire les détails de chaque annonce
        for idx, ad_url in enumerate(ad_urls, 1):
            try:
                logger.info(f"[{idx}/{len(ad_urls)}] Extraction: {ad_url}")
                
                ad_data = self.extract_ad_details(ad_url)
                ad_data['category'] = category_name
                
                # Télécharger les images
                self.download_ad_images(ad_data)
                
                ads.append(ad_data)
                self.stats['total_ads'] += 1
                
                # Pause entre les annonces
                time.sleep(2)
                
            except Exception as e:
                logger.error(f"Erreur annonce {ad_url}: {e}")
                self.stats['errors'] += 1
                continue
        
        return ads
    
    def scrape_all_categories(self, categories: List[str] = None) -> Dict[str, List[Dict]]:
        """
        Scrape toutes les catégories spécifiées
        
        Args:
            categories: Liste des clés de catégories à scraper (None = toutes)
            
        Returns:
            Dictionnaire avec les annonces par catégorie
        """
        if categories is None:
            categories = list(self.CATEGORIES.keys())
        
        all_ads = {}
        
        for category_key in categories:
            if category_key not in self.CATEGORIES:
                logger.warning(f"Catégorie inconnue: {category_key}")
                continue
            
            try:
                ads = self.scrape_category(category_key)
                all_ads[category_key] = ads
                
                # Sauvegarder après chaque catégorie
                self.save_intermediate_results(all_ads)
                
            except Exception as e:
                logger.error(f"Erreur catégorie {category_key}: {e}")
                all_ads[category_key] = []
        
        return all_ads
    
    def save_intermediate_results(self, data: Dict):
        """Sauvegarde intermédiaire des résultats"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"data/voursa_intermediate_{timestamp}.json"
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.debug(f"Sauvegarde intermédiaire: {filename}")
    
    def save_results(self, data: Dict, filename: str = None):
        """
        Sauvegarde les résultats finaux
        
        Args:
            data: Données à sauvegarder
            filename: Nom du fichier (auto-généré si None)
        """
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"data/voursa_ads_{timestamp}.json"
        
        # Ajouter les statistiques
        final_data = {
            'metadata': {
                'scraping_date': datetime.now().isoformat(),
                'total_ads': self.stats['total_ads'],
                'total_images': self.stats['total_images'],
                'errors': self.stats['errors'],
                'duration': str(datetime.now() - self.stats['start_time']),
                'parameters': {
                    'ads_per_category': self.ads_per_category,
                    'download_images': self.download_images
                }
            },
            'ads_by_category': data
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(final_data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"\n✅ Résultats sauvegardés: {filename}")
        self.print_statistics()
    
    def print_statistics(self):
        """Affiche les statistiques du scraping"""
        duration = datetime.now() - self.stats['start_time']
        
        print("\n" + "="*50)
        print("STATISTIQUES DU SCRAPING")
        print("="*50)
        print(f"📊 Annonces extraites: {self.stats['total_ads']}")
        print(f"🖼️  Images téléchargées: {self.stats['total_images']}")
        print(f"❌ Erreurs rencontrées: {self.stats['errors']}")
        print(f"⏱️  Durée totale: {duration}")
        print(f"📅 Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*50)
    
    def close(self):
        """Ferme le navigateur et nettoie les ressources"""
        try:
            self.driver.quit()
            logger.info("Driver fermé correctement")
        except Exception as e:
            logger.error(f"Erreur fermeture driver: {e}")


def main():
    """Fonction principale"""
    
    # Configuration
    CONFIG = {
        'ads_per_category': 20,  # Nombre d'annonces par catégorie (paramétrable)
        'headless': False,  # True pour exécuter sans interface graphique
        'download_images': True,  # Télécharger les images
        'image_quality': 'high',  # 'high', 'medium', ou 'thumbnail'
        'categories': None  # None = toutes, ou liste: ['real_estate', 'vehicles']
    }
    
    print("\n" + "="*50)
    print("VOURSA SCRAPER - Extraction Multi-Catégories")
    print("="*50)
    print(f"Configuration:")
    print(f"  • Annonces par catégorie: {CONFIG['ads_per_category']}")
    print(f"  • Mode headless: {CONFIG['headless']}")
    print(f"  • Téléchargement images: {CONFIG['download_images']}")
    print("="*50 + "\n")
    
    # Initialiser le scraper
    scraper = VoursaCompleteScraper(
        ads_per_category=CONFIG['ads_per_category'],
        headless=CONFIG['headless'],
        download_images=CONFIG['download_images'],
        image_quality=CONFIG['image_quality']
    )
    
    try:
        # Scraper toutes les catégories ou seulement celles spécifiées
        results = scraper.scrape_all_categories(CONFIG['categories'])
        
        # Sauvegarder les résultats
        scraper.save_results(results)
        
        print("\n✅ Scraping terminé avec succès!")
        
    except KeyboardInterrupt:
        logger.info("\n⚠️ Scraping interrompu par l'utilisateur")
        scraper.save_results(results, "data/voursa_ads_partial.json")
        
    except Exception as e:
        logger.error(f"❌ Erreur fatale: {e}")
        
    finally:
        scraper.close()


if __name__ == "__main__":
    main()