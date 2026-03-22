# 1️⃣ CREATE – Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: create Resource(data)
        S->>DB: INSERT INTO resources
        DB-->>S: Result / Duplicate error

        alt Duplicate
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            S-->>B: Created resource
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    %% --- List all resources ---
    U->>F: Open Resources page / Refresh list
    F->>B: GET /api/resources
    B->>S: listResources()
    S->>DB: SELECT * FROM resources ORDER BY created_at DESC
    alt DB ok
        DB-->>S: rows[]
        S-->>B: rows[]
        B-->>F: 200 OK { ok:true, data:[…] }
        F-->>U: Render list/table
    else DB error
        DB-->>S: error
        S-->>B: error
        B-->>F: 500 Internal Server Error { ok:false, error:"Database error" }
        F-->>U: Show generic error banner
    end

    %% --- Read one resource (optional helper) ---
    Note over F,B: Read a single item when needed
    F->>B: GET /api/resources/:id
    alt Invalid ID (NaN)
        B-->>F: 400 Bad Request { ok:false, error:"Invalid ID" }
        F-->>U: Show "Invalid ID"
    else ID is a number
        B->>S: getResourceById(id)
        S->>DB: SELECT * FROM resources WHERE id=$1
        alt Found
            DB-->>S: row
            S-->>B: row
            B-->>F: 200 OK { ok:true, data:{…} }
            F-->>U: Fill edit form
        else Not found
            DB-->>S: 0 rows
            S-->>B: not found
            B-->>F: 404 Not Found { ok:false, error:"Resource not found" }
            F-->>U: Show "Not found"
        end
    end
```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant F as Frontend (form.js submit)
    participant B as Backend (PUT /api/resources/:id)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Edit fields + click "Update"
    F->>B: PUT /api/resources/:id (JSON {resourceName, resourceDescription, resourceAvailable, resourcePrice, resourcePriceUnit, resourceId})

    alt Invalid ID (NaN)
        B-->>F: 400 Bad Request { ok:false, error:"Invalid ID" }
        F-->>U: Show "Invalid ID"
    else ID is a number
        B->>V: Validate payload
        alt Validation fails
            V-->>B: errors[]
            B-->>F: 400 Bad Request { ok:false, errors:[…] }
            F-->>U: Show RED validation message (bullets)
        else Validation OK
            B->>S: updateResource(id, dto)
            S->>DB: UPDATE resources SET … WHERE id=$id RETURNING *
            alt Not found
                DB-->>S: 0 rows
                S-->>B: not found
                B-->>F: 404 Not Found { ok:false, error:"Resource not found" }
                F-->>U: Show "Not found (404)… refresh list"
            else Update succeeds
                DB-->>S: updated row
                S-->>B: updated row
                B-->>F: 200 OK { ok:true, data:{…} }
                F-->>U: Show GREEN "Updated"
                F-->>F: window.onResourceActionSuccess({ action:"update", data })
            end
            alt Unique name conflict (PG 23505)
                DB-->>S: error 23505
                S-->>B: conflict
                B-->>F: 409 Conflict { ok:false, error:"Duplicate resource name" }
                F-->>U: Show AMBER duplicate message
            end
        end
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    participant U as User (Browser)
    participant F as Frontend (form.js submit)
    participant B as Backend (DELETE /api/resources/:id)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click "Delete"
    F->>B: DELETE /api/resources/:id  (no body)

    alt Invalid ID (NaN)
        B-->>F: 400 Bad Request { ok:false, error:"Invalid ID" }
        F-->>U: Show "Invalid ID"

    else ID is a number
        B->>S: deleteResource(id)
        S->>DB: DELETE FROM resources WHERE id=$id
        alt Deleted
            DB-->>S: rowCount = 1
            S-->>B: deleted
            B-->>F: 204 No Content
            F-->>U: Show GREEN "Deleted" and remove row
            F-->>F: window.onResourceActionSuccess({ action:"delete" })
        else Not found
            DB-->>S: rowCount = 0
            S-->>B: not found
            B-->>F: 404 Not Found { ok:false, error:"Resource not found" }
            F-->>U: Show "Not found (404)… refresh list"
        end
    end
```