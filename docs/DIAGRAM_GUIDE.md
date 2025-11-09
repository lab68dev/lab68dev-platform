# Text-Based Diagrams Guide

This guide shows you how to create different types of diagrams using text syntax powered by Mermaid.js.

## C4 Diagrams

C4 model diagrams for visualizing software architecture at different levels of abstraction.

### System Context Example

```mermaid
C4Context
title System Context diagram for Internet Banking System

Person(customer, "Personal Banking Customer", "A customer of the bank")
System(banking_system, "Internet Banking System", "Allows customers to view information about their bank accounts")
System_Ext(mail_system, "E-mail system", "The internal Microsoft Exchange e-mail system")
System_Ext(mainframe, "Mainframe Banking System", "Stores all banking information")

Rel(customer, banking_system, "Uses")
Rel_Back(customer, mail_system, "Sends e-mails to")
Rel_Neighbor(banking_system, mail_system, "Sends e-mails", "SMTP")
Rel(banking_system, mainframe, "Uses")
```

### Container Diagram Example

```mermaid
C4Container
title Container diagram for Internet Banking System

Person(customer, "Personal Banking Customer", "A customer of the bank")

Container_Boundary(c1, "Internet Banking System") {
    Container(web_app, "Web Application", "Java, Spring MVC", "Delivers the static content and the Internet banking SPA")
    Container(spa, "Single-Page App", "JavaScript, Angular", "Provides Internet banking functionality to customers")
    Container(mobile_app, "Mobile App", "C#, Xamarin", "Provides limited Internet banking functionality to customers")
    ContainerDb(database, "Database", "SQL Database", "Stores user registration information, hashed auth credentials, access logs, etc.")
    Container(backend_api, "API Application", "Java, Docker Container", "Provides Internet banking functionality via API")
}

System_Ext(email_system, "E-Mail System", "The internal Microsoft Exchange system")
System_Ext(banking_system, "Mainframe Banking System", "Stores all core banking information")

Rel(customer, web_app, "Uses", "HTTPS")
Rel(customer, spa, "Uses", "HTTPS")
Rel(customer, mobile_app, "Uses")

Rel(web_app, spa, "Delivers")
Rel(spa, backend_api, "Uses", "async, JSON/HTTPS")
Rel(mobile_app, backend_api, "Uses", "async, JSON/HTTPS")
Rel_Back(database, backend_api, "Reads from and writes to", "sync, JDBC")

Rel_Back(email_system, backend_api, "Sends e-mails using", "sync, SMTP")
Rel(backend_api, banking_system, "Uses", "sync/async, XML/HTTPS")
```

## Flowchart Diagrams

### Basic Flowchart

```mermaid
flowchart TD
    Start[Start] --> Input[Get User Input]
    Input --> Process[Process Data]
    Process --> Decision{Is Valid?}
    Decision -->|Yes| Success[Display Success]
    Decision -->|No| Error[Show Error]
    Error --> Input
    Success --> End[End]
```

### Advanced Flowchart

```mermaid
flowchart LR
    A[Hard edge] -->|Link text| B(Round edge)
    B --> C{Decision}
    C -->|One| D[Result one]
    C -->|Two| E[Result two]
    D --> F((Circle))
    E --> F
```

## Sequence Diagrams

### API Call Sequence

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    
    User->>Frontend: Click Submit
    Frontend->>API: POST /api/data
    activate API
    API->>Database: Query Data
    activate Database
    Database-->>API: Return Results
    deactivate Database
    API-->>Frontend: JSON Response
    deactivate API
    Frontend-->>User: Display Results
```

### Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Client
    participant Auth
    participant API
    
    User->>Client: Enter credentials
    Client->>Auth: POST /auth/login
    Auth->>Auth: Validate credentials
    alt Credentials valid
        Auth-->>Client: Return JWT token
        Client->>API: GET /api/data (with token)
        API->>API: Verify token
        API-->>Client: Return data
        Client-->>User: Display data
    else Credentials invalid
        Auth-->>Client: 401 Unauthorized
        Client-->>User: Show error
    end
```

## Class Diagrams

### Object-Oriented Design

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
        +move()
    }
    class Dog {
        +String breed
        +bark()
        +fetch()
    }
    class Cat {
        +String color
        +meow()
        +scratch()
    }
    class Owner {
        +String name
        +List~Animal~ pets
        +adopt(Animal)
    }
    
    Animal <|-- Dog : Inherits
    Animal <|-- Cat : Inherits
    Owner "1" --> "*" Animal : owns
```

## Entity Relationship Diagrams

### Database Schema

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER ||--o{ DELIVERY-ADDRESS : uses
    PRODUCT-CATEGORY ||--|{ PRODUCT : contains
    PRODUCT ||--o{ LINE-ITEM : "ordered in"
    
    CUSTOMER {
        int id PK
        string name
        string email
        string phone
    }
    ORDER {
        int id PK
        int customer_id FK
        date order_date
        string status
        decimal total
    }
    LINE-ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal price
    }
    PRODUCT {
        int id PK
        int category_id FK
        string name
        decimal price
        string description
    }
```

## Gantt Charts

### Project Timeline

```mermaid
gantt
    title Software Development Project
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements Analysis    :a1, 2024-01-01, 30d
    System Design           :a2, after a1, 20d
    section Development
    Backend Development     :a3, after a2, 40d
    Frontend Development    :a4, after a2, 45d
    Database Setup          :a5, after a2, 15d
    section Testing
    Unit Testing            :a6, after a3, 10d
    Integration Testing     :a7, after a4, 15d
    UAT                     :a8, after a7, 10d
    section Deployment
    Production Deployment   :a9, after a8, 5d
    Documentation          :a10, after a9, 10d
```

## State Diagrams

### Application States

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Loading : User Action
    Loading --> Success : Data Loaded
    Loading --> Error : Load Failed
    Error --> Idle : Reset
    Success --> Processing : Process Data
    Processing --> Success : Complete
    Processing --> Error : Error Occurred
    Success --> [*]
    
    state Loading {
        [*] --> FetchingData
        FetchingData --> ValidatingData
        ValidatingData --> [*]
    }
```

## User Journey Maps

### Customer Experience

```mermaid
journey
    title Customer Purchase Journey
    section Discovery
      Search for product: 5: Customer
      View product details: 4: Customer
      Read reviews: 4: Customer
    section Decision
      Compare prices: 3: Customer
      Add to cart: 5: Customer
      Apply coupon: 4: Customer
    section Purchase
      Enter shipping info: 3: Customer
      Enter payment: 2: Customer
      Confirm order: 5: Customer
    section Post-Purchase
      Receive confirmation: 5: Customer, System
      Track shipment: 4: Customer, System
      Receive product: 5: Customer
```

## Tips & Best Practices

1. **C4 Diagrams**: Start with context, then drill down to containers and components
2. **Flowcharts**: Use clear node shapes - rectangles for processes, diamonds for decisions
3. **Sequence Diagrams**: Number interactions for complex flows using `autonumber`
4. **Class Diagrams**: Show relationships clearly with proper multiplicity
5. **ER Diagrams**: Always specify primary keys (PK) and foreign keys (FK)
6. **Gantt Charts**: Use realistic date formats and task dependencies
7. **State Diagrams**: Keep states simple and transitions clear
8. **Journey Maps**: Include emotional ratings (1-5) for each step

## Resources

- [Mermaid Official Documentation](https://mermaid.js.org/)
- [C4 Model](https://c4model.com/)
- [Flowchart Syntax](https://mermaid.js.org/syntax/flowchart.html)
- [Sequence Diagram Syntax](https://mermaid.js.org/syntax/sequenceDiagram.html)
