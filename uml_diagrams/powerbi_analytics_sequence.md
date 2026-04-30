# PowerBI Analytics Sequence Diagram

This diagram documents the advanced data aggregation flow for the PowerBI-style Analytics Dashboard, showing how pedagogical data is transformed into actionable visual insights.

## 🔄 Sequence: Analytics Data Aggregation Flow

```mermaid
sequenceDiagram
    title: Analytics Data Aggregation Flow
    autonumber
    participant USER as INSPECTOR
    participant FE as FRONT END (React)
    participant AC as AnalyticsController
    participant AS as AnalyticsService
    participant DB as Data Base (Repos)

    Note over USER, DB: interaction : high-performance data aggregation for BI

    USER->>FE: 1 : navigates to Analytics page
    FE->>AC: 2 : Get-api-inspector-analytics-powerbi
    AC->>AS: 3 : getInspectorAnalytics(inspectorId)
    
    par parallel data retrieval
        AS->>DB: 4 : countActivitiesByInspector(id)
        AS->>DB: 5 : countReportsByInspector(id)
        AS->>DB: 6 : findAverageScoreByInspector(id)
    and
        AS->>DB: 7 : findActivitiesOverTime(id, Monthly/Yearly)
    and
        AS->>DB: 8 : findTeacherPerformanceMetrics(id)
    end

    rect rgb(240, 240, 255)
        Note right of AS: 9 : Perform BI Calculations:<br/>- Trend Analysis<br/>- Status Distribution<br/>- Impact Mapping (Trainings vs Scores)
    end

    AS-->>AC: 10 : InspectorAnalyticsDto (KPIs, Charts, Maps)
    AC-->>FE: 11 : 200 OK
    
    rect rgb(245, 245, 255)
        Note left of FE: 12 : Render Dynamic Charts:<br/>- AreaChart (Trends)<br/>- PieChart (Distributions)<br/>- BarChart (Comparisons)
    end
    
    FE-->>USER: 13 : Displays Command Center Dashboard
```

## 📋 Key Operations

| Operation | Component | Description |
| :--- | :--- | :--- |
| **KPI Extraction** | `AnalyticsService` | Aggregates high-level metrics like Total Activities, Finalized Reports, and Global Quality Index. |
| **Trend Analysis** | `DB Repositories` | Uses temporal queries to group activities by month/year for time-series visualization. |
| **Impact Analysis** | `AnalyticsService` | Correlates formation activities with teacher score trends to measure pedagogical impact. |
| **UI Rendering** | `Recharts Library` | Transforms the JSON dataset into interactive, premium-designed SVG charts with tooltips and animations. |
