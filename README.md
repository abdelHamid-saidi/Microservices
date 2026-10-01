# Microservices — supports de cours

Projet pédagogique : passer d’APIs Node isolées à une architecture bookstore (front Express, LoopBack 4, MongoDB, API Gateway, RabbitMQ), le tout sous Docker.

**Prérequis :** Docker Desktop.

> Ne lancez **qu’un dossier à la fois** (`docker compose up -d`). Les ports (3000, 8080, 9001, 27017, etc.) sont partagés.

```powershell
cd <dossier>
docker compose up -d
docker compose down
```

---

## Parcours des dossiers

| Dossier | Idée | Accès utiles |
|---------|------|----------------|
| `exercice` | Gateway Node (`fast-gateway`) + microservices **order** et **payment** | http://localhost:9001/api/order/order-list · http://localhost:9001/api/payment/payment-list |
| `exercice-bookstore` | Front Express + API LoopBack **Book** + MongoDB | http://localhost:8080/inventory |
| `cas-pratique-Frontend` | Même cas (inventaire : liste + formulaire Add Book) | http://localhost:8080/inventory |
| `exercice-segmentation` | Book + **Order** (3001) + **Payment** (3002) + gateway | Front 8080, gateway 9001 |
| `cas-pratique` | Même architecture, le **front ne parle qu’à la gateway** | Front **8082**, gateway **9001** |
| `exercice-rabbitmq` | Communication asynchrone Inventory → Order et Order → Payment | Front 8080 · RabbitMQ UI http://localhost:15672 (`guest` / `guest`) |

---

## `exercice` — gateway et conteneurs

Trois APIs Express sur un réseau Docker. Le gateway route `/api/order` et `/api/payment` vers les noms de conteneurs (`order`, `payment`).

- Gateway : **9001**
- Order : **8081**
- Payment : **8082**

---

## `exercice-bookstore` / `cas-pratique-Frontend` — inventaire

Page `/inventory` :

1. Liste dynamique `Titre - Auteur` (GET LoopBack `/books`)
2. Formulaire **Add Book** (POST vers MongoDB via LoopBack)
3. Après Submit, la liste se rafraîchit et le formulaire est vide

- Front : **8080**
- API Book : **3000** (`/books`, `/explorer`)
- MongoDB : **27017**

---

## `exercice-segmentation` — Order, Payment, gateway

Sur le modèle de Book :

- **Order** (3001) : customer, bookTitle, quantity
- **Payment** (3002) : orderRef, amount, method
- Un seul MongoDB, bases `bookstore` / `order` / `payment`
- Vues front : `/inventory`, `/orders`, `/payments`

---

## `cas-pratique` — front via API Gateway

Même stack, avec la règle d’architecture du cas pratique :

- Front **8082**
- Toutes les requêtes HTTP du front passent par **http://gateway:9001**  
  (`/api/inventory`, `/api/order`, `/api/payment`)
- Enchaînement : créer un livre → une commande → un paiement

---

## `exercice-rabbitmq` — messagerie

Même bookstore, plus RabbitMQ (`5672` AMQP, `15672` UI).

| Scénario | Producteur | File | Consommateur |
|----------|------------|------|----------------|
| 1 | Inventory (DELETE livre) | `inventory.deleted` | Order supprime les commandes liées |
| 2 | Order (POST commande) | `order.created` | Payment crée un paiement automatique |

---

## Ports récapitulatifs

| Service | Port |
|---------|------|
| Front Express | 8080 (sauf `cas-pratique` : **8082**) |
| API Gateway | 9001 |
| Inventory / Book | 3000 |
| Order | 3001 (`exercice` : 8081) |
| Payment | 3002 (`exercice` : 8082) |
| MongoDB | 27017 |
| RabbitMQ | 5672 / 15672 |
