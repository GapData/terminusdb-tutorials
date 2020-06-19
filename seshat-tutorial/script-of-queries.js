let stages = [];
let rdf_source = 'https://terminusdb.github.io/terminus-tutorials/seshat-tutorial/seshat-2018.ttl'
let remote_or_file = (rdf_source.charAt(0) == "/" ? "file" : "remote")

let q = {
    title: "Schema Creation - Step 1",
    text: `The first step is to create the schema - because the schema is 
        large and complex we will do it in parts. First, we create the document types 
        - the basic types of data that we are interested in and organise them into a taxonomy`,
    insert: `WOQL.when(true, 
        WOQL.and(
            WOQL.doctype("Organization")
                .label("Organization")
                .description("A human organization of any type - has the capacity to act as a unit, in some sense")
                .abstract(),
            WOQL.add_class("PoliticalAuthority")
                .label("Political Authority")
                .description("A human social group with some autonomous political authority.")
                .parent("Organization"),
            WOQL.add_class("Polity")
                .label("Polity")
                .description("A polity is defined as an independent political unit. Kinds of polities range from villages (local communities) through simple and complex chiefdoms to states and empires. A polity can be either centralized or not (e.g., organized as a confederation). What distinguishes a polity from other human groupings and organizations is that it is politically independent of any overarching authority; it possesses sovereignty. Polities are defined spatially by the area enclosed within a boundary on the world map. There may be more than one such areas. Polities are dynamical entities, and thus their geographical extent may change with time. Thus, typically each polity will be defined by a set of multiple boundaries, each for a specified period of time. For prehistoric periods and for areas populated by a multitude of small-scale polities we use a variant called quasi-polity.")
                .parent("PoliticalAuthority"),
            WOQL.add_class("QuasiPolity")
                .label("Quasi-Polity")
                .description("The polity-based approach is not feasible for those periods when a region is divided up among a multitude of small-scale polities (e.g., independent villages or even many small chiefdoms). In this instance we use the concept of 'quasi-polity'. Similarly, for societies known only archaeologically we may not be able to establish the boundaries of polities, even approximately. Quasi-polity is defined as a cultural area with some degree of cultural homogeneity (including linguistic, if known) that is distinct from surrounding areas. For example, the Marshall Islands before German occupation had no overarching native or colonial authority (chiefs controlled various subsets of islands and atolls) and therefore it was not a polity. But it was a quasi-polity because of the significant cultural and linguistic uniformity.<P>We collect data for the quasi-polity as a whole. This way we can integrate over (often patchy) data from different sites and different polities to estimate what the 'generic' social and political system was like. Data is not entered for the whole region but for a 'typical' polity in it. For example, when coding a quasi-polity, its territory is not the area of the region as a whole, but the average or typical area of autonomous groups within the NGA.")
                .parent("PoliticalAuthority"),
            WOQL.add_class("SubPolity")
                .label("Sub-Polity")
                .description("A human social group that has some governing authority within a specific region or area of a polity - used to describe regional governments, etc.")
                .parent("PoliticalAuthority"),
            WOQL.add_class("SupraculturalEntity")
                .label("Supra-Cultural Entity")
                .description("Political Authority entities are often embedded within larger-scale cultural groupings of polities or quasipolities. These are sometimes referred to as 'civilizations'. For example, medieval European kingdoms were part of Latin Christendom. During the periods of disunity in China, warring states there, nevertheless, belonged to the same Chinese cultural sphere. Archaeologists often use 'archaeological traditions' to denote such large-scale cultural entities (for example, Peregrine's Atlas of Cultural Evolution). Note, 'supracultural entity' refers to cultural interdependence, and is distinct from a political confederation or alliance, which should be coded under 'supra-polity relations.'.")
                .parent("Organization"),
            WOQL.add_class("InterestGroup")
                .label("Interest Group")
                .description("An Interest Group (IG) is a social group that pursues some common interest, so that its members are united by a common goal or goals. Polities and religious cults are also interest groups, but this category is broader. It also includes ethnic groups, professional associations, warrior bands, solidarity associations, mutual aid societies, firms and banks (including their pre-modern variants), etc. The Interest Group is defined sociologically, not geographically. However, a geographic area, enclosed within a boundary, refering to its area of operation, may be associated with it in the same way as with a polity or a Religious System(RS). ")
                .parent("Organization"),
            WOQL.doctype("Settlement")
                .label("Settlement")
                .description("A semi-permanent or permanent human settlement")
                .parent("Organization"),
            WOQL.add_class("City")
                .label("City")
                .description("A concentrated human settlement, typically large")
                .parent("Settlement"),
            WOQL.doctype("CitedWork").label("Cited Work").property("remote_url", "xsd:anyURI"),
        )
    )`,

    query: `WOQL.and(
            WOQL.quad("v:Class", "rdf:type", "owl:Class", "db:schema"),
            WOQL.opt().quad("v:Class", "rdfs:label", "v:Label", "db:schema"),
            WOQL.opt().quad("v:Class", "rdfs:subClassOf", "v:Parent", "db:schema"),
            WOQL.opt().quad("v:Child", "rdfs:subClassOf", "v:Class", "db:schema"),
            WOQL.opt().quad("v:Class", "rdfs:comment", "v:Comment", "db:schema"),
            WOQL.opt().quad("v:Class", "tcs:tag", "v:Abstract", "db:schema")
    )`,

    view: `view = View.graph();
        view.edges(["v:Class", "v:Parent"], ["v:Child", "v:Class"], ["v:Class", "v:Abstract"]);
        view.height(800)
        view.width(1200)
        view.edge("v:Class", "v:Parent").text("Parent Class").distance(120)
        view.edge("v:Child", "v:Class").text("Parent Class").distance(120)
        view.edge("v:Class", "v:Abstract").text("Abstract Class").weight(2).color([0,0,0])
        view.node("Parent").size(20).color([180, 220, 250]).icon({label: true, size: 0.7, color: [90, 90, 140]})
        view.node("Class").text("v:Label").size(32).collisionRadius(80).icon({label: true, size: 0.7, color: [24, 34, 89]}
   )`
}

stages.push(q);

var q2 = {
    title: "Schema Creation - Step 2 - Topic Hierarchy",
    text:`The second stage is creating a topic taxonomy which will allow us to group together 
    related properties by topic. We create the topics as a class hierarchy`, 
    insert: `WOQL.when(true, 
        WOQL.and(
            WOQL.add_class("Topic")
                .label("Topic Class")
                .description("A class that represents a topic")
                .abstract(),
            WOQL.add_class("SocialComplexity")
                .label("Social Complexity")
                .description("Social Complexity Variables")
                .parent("Topic"),
            WOQL.add_class("Politics")
                .parent("Topic")
                .label("Politics")
                .description("Dealing with political authority and organization"),     
            WOQL.add_class("Legal")
                .label("Legal")
                .description("Dealing with legal matters")
                .parent("Politics"),
            WOQL.add_class("Work")
                .parent("Topic")
                .label("Work")
                .description("Dealing with work"),
            WOQL.add_class("Food")
                .label("Food")
                .parent("Topic")
                .description("Dealing with food"),
            WOQL.add_class("Ritual")
                .label("Ritual")
                .parent("Topic")
                .description("Dealing with rituals"),
            WOQL.add_class("Finance")
                .label("Finance")
                .description("Dealing with financial affairs")
                .parent("Politics"),
            WOQL.add_class("Money")
                .label("Money")
                .parent("Finance")
                .description("Dealing with money"),
            WOQL.add_class("Economics")
                .label("Economics")
                .description("Dealing with Economics"),
            WOQL.add_class("Agriculture")
                .label("Agriculture")
                .description("Dealing with agricultural matters")
                .parent("Food"),
            WOQL.add_class("Fishing")
                .label("Fishing")
                .description("Dealing with fishing matters")
                .parent("Food"),
            WOQL.add_class("Hunting")
                .label("Hunting")
                .description("Dealing with hunting matters")
                .parent("Food"),
            WOQL.add_class("Military")
                .label("Military")
                .parent("Topic")
                .description("Dealing with Military matters"),
            WOQL.add_class("Mining")
                .label("Mining")
                .parent("Topic")
                .description("Dealing with Mining and Mineral Extraction"),
            WOQL.add_class("Minerals")
                .label("Minerals")
                .parent("Topic")
                .description("Dealing with Minerals"),
            WOQL.add_class("Metals")
                .label("Metals")
                .description("Dealing with Metals")
                .parent("Minerals"),
            WOQL.add_class("Transport")
                .label("Transport")
                .parent("Topic")
                .description("Dealing with Transport matters"),
            WOQL.add_class("Communication")
                .label("Communication")
                .parent("Topic")
                .description("Dealing with Communication"),
            WOQL.add_class("Science")
                .label("Science")
                .parent("Topic")
                .description("Dealing with scientific method"),
            WOQL.add_class("Writing")
                .label("Writing")
                .parent("Topic")
                .description("Dealing with written word"),
            WOQL.add_class("Literature")
                .label("Literature")
                .parent("Topic")
                .description("Dealing with literature"),
            WOQL.add_class("Ideology")
                .label("Ideology")
                .parent("Topic")
                .description("Dealing with Ideological matters"),
            WOQL.add_class("Construction")
                .label("Construction")
                .parent("Topic")
                .description("Dealing with Construction matters"),
            WOQL.add_class("Housing")
                .label("Housing")
                .description("Dealing with housing matters")
                .parent("Construction"),
            WOQL.add_class("Public")
                .label("Public")
                .description("Dealing with public, collective characteristics, decision making, etc"),
            WOQL.add_class("Private")
                .parent("Topic")
                .label("Private")
                .description("Dealing with private, individual or factional decision making"),
            WOQL.add_class("InternalAffairs")
                .label("Internal Affairs")
                .parent("Topic")
                .description("Dealing with a group's internal organisation"),
            WOQL.add_class("ExternalAffairs")
                .label("External Affairs")
                .parent("Topic")
                .description("Dealing with a group's external affairs"),
            WOQL.add_class("Scale")
                .label("Scale")
                .parent("Topic")
                .description("Dealing with Social Scale"),
            WOQL.add_class("BureaucraticSystem")
                .label("Bureaucratic System")
                .description("A bureaucratic system, decisions are made by office holders")
                .parent("InternalAffairs", "Politics"),
            WOQL.add_class("HierarchicalComplexity")
                .label("Hierarchical Complexity")
                .description("Encodes the number of levels in the most important hierarchies of a social system.")
                .parent("SocialComplexity"),
            WOQL.add_class("MonetarySystem")
                .label("Monetary System")
                .description("The System that produces money")
                .parent("Finance", "Money", "Economics"),
            WOQL.add_class("Infrastructure")
                .label("Infrastructure")
                .description("The built infrastructure that a society depends upon")
                .parent("Construction"),
            WOQL.add_class("PostalSystem")
                .label("Postal System")
                .description("A system for sending physical messages")
                .parent("Communication", "Infrastructure", "Transport"),
            WOQL.add_class("Professions")
                .label("Professions")
                .description("A system of professional work")
                .parent("Work"),
            WOQL.add_class("SpecialSites")
                .label("Special Sites")
                .description("Sites not associated with residential areas. This position is primarily useful for coding archaneologically known societies.")
                .parent("Infrastructure", "Construction"),            
            WOQL.add_class("SpecializedBuildings")
                .label("Specialized Buildings")
                .description("Polity-owned: includes owned by the community, or the state.")
                .parent("Public", "Construction"),            
            WOQL.add_class("SupraPolityRelations")
                .label("Supra-Polity Relations")
                .description("Relating to relationships between polities.")
                .parent("ExternalAffairs"),
            WOQL.add_class("TransportInfrastructure")
                .label("Transport Infrastructure")
                .description("Relating to Transport Infrastructure.")
                .parent("Transport", "Infrastructure"),            
            WOQL.add_class("WritingGenre")
                .label("Written Genres")
                .description("Relating to different types of written material.")
                .parent("Literature","SocialComplexity"),
            WOQL.add_class("Burial")
                .label("Burial")
                .parent("Ritual")
                .description("Burial Related Variables"),                                   
            WOQL.add_class("Resilience")
                .label("Resilience")
                .parent("Topic")
                .description("Resilience Related Variables"),            
            WOQL.add_class("Religion")
                .label("Religion")
                .parent("Ideology")
                .description("Relating to religion"),            
            WOQL.add_class("WritingSystem")
                .label("Writing System")
                .description("Relating to different types of a writing system.")
                .parent("Writing", "SocialComplexity"),            
            WOQL.add_class("Naval")
                .label("Naval")
                .parent("Topic")
                .description("Dealing with naval matters"),            
            WOQL.add_class("Entertainment")
                .label("Entertainment")
                .description("Dealing with entertainment"),            
            WOQL.add_class("MeasurementSystem")
                .label("Measurement System")
                .description("Textual evidence of a measurement system: measurement units are named in sources (e.g. pound, aroura). Archaeological evidence includes finding containers of standard volume, etc. ('inferred presence')")
                .parent("Science", "SocialComplexity"),                             
        )
    )`, 
    query: `WOQL.and(
        WOQL.quad("v:Class", "rdf:type", "owl:Class", "db:schema"),
        WOQL.sub("v:Class", "scm:Topic"),
        WOQL.opt().quad("v:Class", "rdfs:label", "v:Label", "db:schema"),
        WOQL.opt().quad("v:Class", "rdfs:subClassOf", "v:Parent", "db:schema"),
        WOQL.opt().quad("v:Child", "rdfs:subClassOf", "v:Class", "db:schema"),
        WOQL.opt().quad("v:Class", "rdfs:comment", "v:Comment", "db:schema"),
        WOQL.opt().quad("v:Class", "tcs:tag", "v:Abstract", "db:schema")
    )`,
    view: `view = View.graph();
    view.edges(["v:Class", "v:Parent"], ["v:Child", "v:Class"], ["v:Class", "v:Abstract"]);
    view.height(800);
    view.width(1200);
    view.edge("v:Class", "v:Parent").text("Parent Class").distance(120);
    view.edge("v:Child", "v:Class").text("Parent Class").distance(120);
    view.edge("v:Class", "v:Abstract").text("Abstract Class").weight(2).color([0,0,0]);
    view.node("Parent").size(20).color([180, 220, 250]).icon({label: true, size: 0.7, color: [90, 90, 140]});
    view.node("Class").text("v:Label").size(32).collisionRadius(80).icon({label: true, size: 0.7, color: [24, 34, 89]})`
}

stages.push(q2);

let q3 = {
    title: "Step 3 - Viewing Sample of Data to be imported",
    text: "We want to import data from an existing dump of rdf - the first steps is to take a look at the data - we can query the original RDF directly with WOQL to view a sample of the data before we import it.",
    query: `WOQL.limit(30).get(
    WOQL.as("v:Node")
        .as("v:Predicate")
        .as("v:Target")
        )
    .${remote_or_file}("${rdf_source}",{"type":"turtle"})`
}

stages.push(q3);

let q4 = {
    text: "Next we import the polities from the dataset - each representing a unique historical society",
    insert: `WOQL.with("temp://graph", WOQL.remote("${rdf_source}", {"type":"turtle"}),
        WOQL.and(
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Polity_ID", "type", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#Polity", "temp://graph"),
                    WOQL.re("/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                    WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID")
                ), 
                WOQL.insert("v:Subject_ID", "Polity")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Polity_ID", "type", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#Polity", "temp://graph"),
                    WOQL.re("/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                    WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID"),
                    WOQL.quad("v:Polity_ID", "label", "v:PLabel", "temp://graph"),
                ),
                WOQL.add_triple("v:Subject_ID", "label", "v:PLabel")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Polity_ID", "type", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#Polity", "temp://graph"),
                    WOQL.re("/candidate/(.*)","v:Polity_ID",["v:Polity_ID_All","v:Polity_ID_Extension"]),
                    WOQL.idgen("doc:",["v:Polity_ID_Extension"],"v:Subject_ID"),
                    WOQL.quad("v:Polity_ID", "comment", "v:PDescr", "temp://graph"),
                ),
                WOQL.add_triple("v:Subject_ID", "comment", "v:PDescr")
            )
        )
    )`,
    query: `WOQL.and(
	    WOQL.triple("v:ID", "type", "scm:Polity"),
        WOQL.opt().triple("v:ID", "label", "v:Label")
    )`
}

stages.push(q4);

let q5 = {
    text: `Next we need to create some enumerated types - sets of valid values for certain variables. 
    The first enumerated type is confidence - this allows us to specify that a value is disputed, uncertain, inferred or dubious`,
    insert: `let choices = [
        ["scm:inferred", "Inferred", "The value has been logically inferred from other evidence"],
        ["scm:disputed", "Disputed", "The evidence is disputed - some believe this data to be incorrect"],
        ["scm:dubious", "Dubious", "The evidence is dubious - most believe this data to be incorrect"],
        ["scm:uncertain", "Uncertain", "The evidence has a high degree of uncertainty"]
    ]

    WOQL.when(true).and(
        WOQL.add_class("Enumerated").label("Enumerated Type").description("A type that consists of a fixed set of choices"),
        WOQL.generateChoiceList("scm:Confidence", "Confidence Tags", "Tags that can be added to values to indicate confidence in the value of some piece data", choices)
    )`,
    query: `WOQL.and(
        WOQL.quad("v:ID", "type", "scm:Confidence", "schema"),
        WOQL.opt().quad("v:ID", "label", "v:Label", "schema"),
        WOQL.opt().quad("v:ID", "type", "v:Type", "schema")
    )`,
    view: `view = View.graph();
    view.edges(["v:ID", "v:Type"])
    view.node("ID").size(20).text("v:Label").color([180, 220, 250]).icon({label: true, size: 0.7, color: [90, 90, 140]})
    view.node("Type").text("v:Type").size(32).collisionRadius(80).icon({label: true, size: 0.7, color: [24, 34, 89]})`
}

stages.push(q5);

let q6 = {
    text: "We also need enumerated types to record epistemic state (present, absent, unknown) and a few other choices",
    insert: `let epistemic_choices = [
        ["scm:absent", "Absent", "The feature was absent in this historical context"],
        ["scm:present", "Present", "The feature was present in this historical context"],
        ["scm:unknown", "Unknown", "It can be said with a high degree of confidence that it is not known whether the feature was present or absent in the context."]
    ]
    let centralization_choices = [
        ["scm:unknown_centralization", "Unknown", "Unknown Centralization"], 
        ["scm:loose", "Loose", \`the central government exercises a certain degree of control,
            especially over military matters and international relations. 
            Otherwise the regional rulers are left alone\`],
        ["scm:quasipolity", "Quasi-polity", "Used for a situation where the poliity is in reality many politically independent groups"], 
        ["scm:no_centralization",  "None", "There is no centralised system"],
        ["scm:confederated_state", "Confederated State", \`regions enjoy a large degree of autonomy in internal (regional) government. 
            In particular, the regional governors are either hereditary rulers, or are elected by regional elites 
            or by the population of the region; and regional governments can levy and dispose of regional taxes.\`],
        ["scm:nominal", "Nominal", \`regional rulers pay only nominal allegiance to the overall ruler and maintain independence on 
            all important aspects of governing, including taxation and warfare. (example: Japan during the Sengoku period)\`],
        ["scm:unitary_state", "Unitary State", \`regional governors are appointed and removed by the central authorities, 
            taxes are imposed by, and transmitted to the center\`],
    ]

    let supra_polity_choices = [
        ["scm:vassalage","Vassalage", \`A central government exercises a certain degree of control, 
        especially over military matters and international relations. Otherwise the polity is left alone\`], 
        ["scm:no_supra_polity_relations", "None", "No relations with any supracultural entity"], 
        ["scm:nominal_allegiance", "Nominal Allegiance", \`Paying only nominal allegiance to the overall ruler and 
        maintaining independence on all important aspects of governing, including taxation and warfare.\`],
        ["scm:personal_union", "Personal Union", "The focal polity is united with another, or others, as a result of a dynastic marriage"], 
        ["scm:alliance", "Alliance", \`Belongs to a long-term military-political alliance of independent polities (long-term refers to more
            or less permanent relationship between polities extending over multiple years\`],
        ["scm:unknown_supra_polity_relations", "Unknown", "Unknown Relations"]        
    ]

    let evolution_choices = [
        ["scm:assimilation", "Cultural Assimilation", "Assimilation by another political authority in the absence of substantial population replacement"], 
        ["scm:continuity", "Continuity", "Gradual change without any discontinuity"],
        ["scm:elite_migration","Elite Migration", "The preceding elites were replaced by new elites coming from elsewhere"],
        ["scm:population_migration", "Population Migration", "Evidence for substantial population replacement"],
        ["scm:unknown_evolution", "Unknown", "Unknown Evolution"]        
    ]

    let income_choices = [
        ["scm:governed_population", "Governed Population", "The official directly collects tribute from the population (for example, the kormlenie system in Medieval Russia)"],
        ["scm:land", "Land", "Living off land supplied by the state."],
        ["scm:state_salary", "State Salary", "can be paid either in currency or in kind (e.g., koku of rice)."], 
        ["scm:no_income", "No Income", \`The state officials are not compensated (example: in the Republican and Principate Rome 
            the magistrates were wealthy individuals who served without salary, motivated by prestige and social or career advancement)\`],
        ["scm:unknown_income", "Unknown", "Unknown source of income"]        
    ]
    WOQL.when(true, 
        WOQL.and(
            WOQL.generateChoiceList("scm:EpistemicState", "Epistemic State", "The existence of a feature in the historical record", epistemic_choices), 
            WOQL.generateChoiceList("scm:DegreeOfCentralization", "Degree of Centralization", "An indication of how centralized a political authority was", centralization_choices),
            WOQL.generateChoiceList("scm:SupraPolityRelations", "Supra-Polity Relations", "The relationship between a polity and its paramount power", supra_polity_choices),
            WOQL.generateChoiceList("scm:PoliticalEvolution", "Political Evolution", "How a political authority evolves into another one", evolution_choices),
            WOQL.generateChoiceList("scm:IncomeSource", "Income Source", "A source of income", income_choices)
        )
    )`,
    query: `WOQL.and(
    	WOQL.sub("v:Choice_Type", "scm:Enumerated"),
        WOQL.quad("v:Choice", "type", "v:Choice_Type", "schema")
    )`
}

stages.push(q6);

let q7 = {
    text: `Next we need to add scoping for variables - to allow us to specify that values change over time and can be uncertain. 
    Each value can have a start and end year (or uncertain range of years) and a confidence level as well as an editorial note associated`,
    insert: `WOQL.when(true, WOQL.and(
        WOQL.add_class("ScopedValue")
            .abstract()
            .property("start", "xdd:integerRange")
                .label("From")
                .description("The start of a time range")
            .property("end", "xdd:integerRange")
                .label("To")
                .description("The end of a time range")
            .property("confidence", "scm:Confidence")
                .label("Confidence")
                .description("Qualifiers of the confidence of a variable value")
            .property("notes", "scm:Note")
                .label("Notes")
                .description("Editorial notes on values"),
        WOQL.add_quad("tcs:Document", "rdfs:subClassOf", "scm:ScopedValue", "db:schema"),
        WOQL.add_class("Note").label("A Note on a value")
            .description("Editorial note on the value")
            .property("citation", "scm:CitedWork")
                .label("Citation")
                .description("A link to a cited work")
            .property("quotation", "xsd:string")
                .label("Quotation")
                .description("A quotation from a work")
    ))`,
    query: `WOQL.and(
        WOQL.quad("v:Property", "domain", "v:Domain", "schema"),
        WOQL.quad("v:Property", "label", "v:Label", "schema"),
        WOQL.eq("v:Domain", "scm:ScopedValue"),
        WOQL.quad("v:Property", "range", "v:Range", "schema")
    )`,
    view: `view = View.graph();
    view.height(800);
    view.width(1200);
    view.edges(["Domain", "Property"], ["Property", "Range"])
    view.edge("Domain", "Property").text("Domain Class").color([20, 200, 20]).distance(120)
    view.edge("Property", "Range").text("Property Type").distance(100)
    view.node("Range").text("v:Range").size(20).collisionRadius(100).color([220, 250, 180]).icon({label: true, size: 0.8, color: [50, 60, 40]})
    view.node("Property").text("v:Label").size(24).collisionRadius(100).color([180, 220, 250]).icon({label: true, size: 0.8, color: [50, 60, 40]})
    view.node("Domain").color([220, 250, 180]).size(20).collisionRadius(100).icon({label: true, size: 0.7, color: [24, 34, 89]})`
}

stages.push(q7);

let q8 = {
    text: "The next step is to add scoping to the polities - most importantly the start and end dates defining the life span of the historical society",
    insert: `WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
       WOQL.and( 
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN"),        
                    WOQL.re("/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
                    WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:LS_ID", "graph://temp"),
                    WOQL.quad("v:LS_ID", "http://dacura.scss.tcd.ie/ontology/dacura#start", "v:Start_Time", "graph://temp"),
                    WOQL.cast("v:Start_Time", "xdd:integerRange", "v:Start_Value", "graph://temp")    
                ),
                WOQL.add_triple("v:Subject_ID", "scm:start", "v:Start_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN"),        
                    WOQL.re("/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
                    WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:LS_ID", "graph://temp"),
                    WOQL.quad("v:LS_ID", "http://dacura.scss.tcd.ie/ontology/dacura#end", "v:End_Time", "graph://temp"),
                    WOQL.cast("v:End_Time", "xdd:integerRange", "v:End_Value", "graph://temp")
                ),
                WOQL.add_triple("v:Subject_ID", "scm:end", "v:End_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN"),        
                    WOQL.re(".*/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
                    WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#confidence", "v:Confidence", "graph://temp"),
                    WOQL.re("#(.*)", "v:Confidence", ["v:Allconf", "v:ConfCode"]),
                    WOQL.idgen("scm:", ["v:ConfCode"], "v:Conf_Value")
                ),
                WOQL.add_triple("v:Subject_ID", "scm:confidence", "v:Conf_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotation"], "v:ID_GEN"),        
                    WOQL.re("/candidate/(.*)", "v:Annotated_ID", ["v:All_PA", "v:All_PA_Ext"]),
                    WOQL.idgen("doc:", ["v:All_PA_Ext"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "comment", "v:Comment", "graph://temp")
                ), WOQL.and(
                        WOQL.insert("v:ID_GEN", "scm:Note"),
                        WOQL.add_triple("v:ID_GEN", "rdfs:comment", "v:Comment"),
                        WOQL.add_triple("v:Subject_ID", "scm:notes", "v:ID_GEN")
                )
            )
        )
    )`,
    query: `WOQL.select("v:Polity", "v:Start", "v:End", "v:Confidence").order_by(WOQL.asc("v:End", "v:Start")).and(
	  WOQL.triple("v:PID", "type", "scm:Polity"),
	  WOQL.triple("v:PID", "label", "v:Polity"),
	  WOQL.opt().triple("v:PID", "start", "v:Start"),
	  WOQL.opt().triple("v:PID", "end", "v:End"),
	  WOQL.opt().triple("v:PID", "confidence", "v:Confidence")
    )`,
    view: `view = View.table();`
}

stages.push(q8);

let q9 = {
    text: "Next we need to create what are called boxes, to allow us to add scoping variables to simple datatypes",
    insert: `WOQL.when(true, WOQL.and(
        WOQL.add_class("Box")
            .label("Box Class")
            .description("A class that represents a boxed datatype")
            .abstract(),
        WOQL.libs("xdd", "box"),
        WOQL.boxClasses("scm:", ["tcs:Document", "scm:Enumerated", "scm:SupraPolityRelations"], ["scm:Confidence", "scm:Topic", "scm:ScopedValue"])        
    ))`,
    query: `WOQL.and(
        WOQL.quad("v:Class", "rdf:type", "owl:Class", "db:schema"),
        WOQL.sub("v:Class", "scm:Box"),
        WOQL.opt().quad("v:Class", "rdfs:label", "v:Label", "db:schema"),
        WOQL.opt().quad("v:Class", "rdfs:subClassOf", "v:Parent", "db:schema"),
        WOQL.opt().quad("v:Child", "rdfs:subClassOf", "v:Class", "db:schema"),
        WOQL.opt().quad("v:Class", "rdfs:comment", "v:Comment", "db:schema"),
        WOQL.opt().quad("v:Class", "tcs:tag", "v:Abstract", "db:schema")
    )`
}

stages.push(q9);


let q11 = {
    text: "Next we want to create all the properties - there are two types of properties - those that are scoped (time, uncertainty) and simple ones that are unscoped - first we will create the unscoped ones",
    insert: `function normaliseID(raw, type){
        if(type == "id"){
            var bits = raw.split(":");
            return (bits.length > 1 ? raw : "scm:" + raw);
        }
        if(type == "type"){
            var bits = raw.split(":");
            if(bits.length > 1) {
                var nr = bits[1];
                return "scm:" + nr.charAt(0).toUpperCase() + nr.slice(1)  
            }
            else {
                return "scm:" +  raw.charAt(0).toUpperCase() + raw.slice(1);
            }
        }
        if(type == "parents"){
            var npars = [];
            if(Array.isArray(raw) && raw.length){
                for(var i = 0 ; i<raw.length; i++){
                    var nr = raw[i].split(":");
                    if(nr.length > 1) npars.push(nr);
                    else {
                        npars.push("scm:" + nr);
                    }
                }
            }
            return npars;
        }
        return raw;
    }


    function createUnscopedProperty(npid, nptype, label, description, domain){
        domain = domain || "scm:PoliticalAuthority";
        nptype = normaliseID(nptype, "type");
        npid = normaliseID(npid, "id");
        return WOQL.add_property(npid, nptype)
            .label(label)
            .description(description)
            .domain(domain);
    }

    WOQL.when(true, WOQL.and(
        createUnscopedProperty("predecessor", "PoliticalAuthority", "Preceding Polity", 
            \`The immediate preceding political authority. This code is based on the core region of the polity 
            (not the NGA region).  E.g. Achaemenid Empire's core region was Persia, 
            where they were preceded by the Median Empire.\`),
        createUnscopedProperty("successor", "PoliticalAuthority", "Succeeding Polity", 
            \`Name. Only name it here and don't code the nature of change 
            (it's coded on the page of the succeeding quasipolity). 
            This code is based on the core region of the current polity (not the NGA region). E.g. 
            Achaemenid Empire's core region was Persia, where they were succeeded by the Macedonian Empire.\`),
        WOQL.add_class("Building")
            .label("Building")
            .description("A specific building.")
            .parent("Construction"),
        createUnscopedProperty("best_building", "Building", "Most Costly Building", 
            "The most impressive or costly building constructed by the political authority"),
        createUnscopedProperty("references", "CitedWork", "References", 
            "The References from the wiki"),        
        createUnscopedProperty("provenance_note", "xsd:string", "Provenance Note", "Provenance Notes")                              
    ))`,
    query: `WOQL.and(
        WOQL.quad("v:A", "v:Property" ,"v:Class", "schema"),
        WOQL.not().eq("v:Property", "rdfs:subClassOf"),
        WOQL.sub("v:Class", "scm:PoliticalAuthority")
    )`
}    

stages.push(q11);

let q12 = {
    text: "Now we import the data for the unscoped properties, mapping it into the new properties that we created - first we import the predecessor relationship between properties",
    insert: `WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
        WOQL.when(
            WOQL.and(
                WOQL.quad("v:AID","v:First_Pred","v:Join","graph://temp"),
                WOQL.quad("v:Join","v:Second_Pred","v:Target","graph://temp"),
                WOQL.re("/candidate/(\\w*)","v:AID",["v:AID_ALL","v:AID_Match"]),
                WOQL.idgen("doc:",["v:AID_Match"], "v:DocID"),        
                WOQL.idgen("http://dacura.scss.tcd.ie/seshat/ontology/seshat#", ["predecessor"], "v:Original_Property"),
                WOQL.eq("v:First_Pred", "v:Original_Property"),
                WOQL.idgen("scm:", ["predecessor"], "v:New_Property"),
                WOQL.eq("v:Second_Pred", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#politicalAuthorityReference"),
                WOQL.re("/candidate/(\\w*)","v:Target",["v:Target_ALL","v:Target_Match"]),
                WOQL.idgen("doc:",["v:Target_Match"], "v:Target_ID"),
            ), WOQL.and(
                WOQL.add_triple("v:DocID", "v:New_Property", "v:Target_ID"),
                WOQL.add_triple("v:Target_ID", "rdf:type", "scm:Polity"),
            )
        ))`,      
    query: `WOQL.and(
        WOQL.triple("v:Polity", "type", "scm:Polity"),
        WOQL.triple("v:Polity", "predecessor", "v:Predecessor"),
        WOQL.triple("v:Polity", "label", "v:Lab"),
        WOQL.triple("v:Predecessor", "label", "v:Plab")
    )`,
    view: `view = View.graph();
    view.edges(["v:Predecessor", "v:Polity"])
    view.node("v:Predecessor").text("v:Plab").icon({label: true})
    view.node("v:Polity").text("v:Lab").icon({label: true})`
}

stages.push(q12);

let q13 = {
    text: "Next we import the successor relationship between polities",
    insert: `WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
    WOQL.when(
        WOQL.and(
            WOQL.quad("v:AID","v:First_Pred","v:Join","graph://temp"),
            WOQL.quad("v:Join","v:Second_Pred","v:Target","graph://temp"),
            WOQL.re("/candidate/(\\w*)","v:AID",["v:AID_ALL","v:AID_Match"]),
            WOQL.idgen("doc:",["v:AID_Match"], "v:DocID"),        
            WOQL.idgen("http://dacura.scss.tcd.ie/seshat/ontology/seshat#", ["successor"], "v:Original_Property"),
            WOQL.eq("v:First_Pred", "v:Original_Property"),
            WOQL.idgen("scm:", ["successor"], "v:New_Property"),
            WOQL.eq("v:Second_Pred", "http://dacura.scss.tcd.ie/seshat/ontology/seshat#politicalAuthorityReference"),
            WOQL.re("/candidate/(\\w*)","v:Target",["v:Target_ALL","v:Target_Match"]),
            WOQL.idgen("doc:",["v:Target_Match"], "v:Target_ID"),
        ), WOQL.and(
            WOQL.add_triple("v:DocID", "v:New_Property", "v:Target_ID"),
            WOQL.add_triple("v:Target_ID", "rdf:type", "scm:Polity"),
        )
    ))`,      
    query: `WOQL.and(
        WOQL.triple("v:Polity", "type", "scm:Polity"),
        WOQL.triple("v:Polity", "successor", "v:Successor"),
        WOQL.triple("v:Polity", "predecessor", "v:Predecessor"),
        WOQL.triple("v:Polity", "label", "v:Lab"),
        WOQL.triple("v:Successor", "label", "v:Slab"),
        WOQL.triple("v:Predecessor", "label", "v:Plab"),
        WOQL.opt().and(
            WOQL.triple("v:Polity", "professional_soldiers", "v:Variable"),
               WOQL.triple("v:Variable", "epistemicState", "v:Presence")
        )
     )`,
    view: ` view = View.graph();
view.height(800);
view.width(1200);
view.edges(["v:Predecessor", "v:Polity"], ["v:Polity", "v:Successor"])
view.node("v:Predecessor").text("v:Plab").icon({label: true})
view.node("v:Successor").text("v:Slab").icon({label: true})
view.node("v:Polity").text("v:Lab").icon({label: true})
view.node("v:Polity", "v:Presence").in("scm:absent").color([255,0,0])
view.node("v:Polity", "v:Presence").in("scm:present").color([0,255,0])
view.node("v:Polity", "v:Presence").in("scm:unknown").color([150,150,150])`
}

stages.push(q13);

let q14 = {
    text: "Now we import the references / footnotes",
    insert: `WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
    WOQL.when(
        WOQL.and(
            WOQL.quad("v:AID","v:First_Pred","v:Join","graph://temp"),
            WOQL.quad("v:Join","v:Second_Pred","v:Target","graph://temp"),
            WOQL.re("/candidate/(\\w*)","v:AID",["v:AID_ALL","v:AID_Match"]),
            WOQL.idgen("doc:",["v:AID_Match"], "v:DocID"),        
            WOQL.eq("v:Second_Pred", "http://dacura.scss.tcd.ie/ontology/dacura#string"),
            WOQL.cast("v:Target", "xsd:string", "v:Value"),
            WOQL.idgen("scm:", ["references_Value"], "v:Value_Type"),
            WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
    ),  WOQL.and(
            WOQL.add_triple("v:DocID", "scm:references", "v:Value_ID"),
            WOQL.insert("v:Value_ID", "scm:CitedWork"),
            WOQL.add_triple("v:Value_ID", "rdfs:label", "v:Value")
        )
    ))`,
    query: `WOQL.limit(100).and(
    WOQL.triple("v:Document", "references", "v:Has_Reference"),
    WOQL.triple("v:Has_Reference", "type", "scm:CitedWork"),
    WOQL.triple("v:Has_Reference", "label", "v:Name")     
)`
}

stages.push(q14);

let q15 = {
    text: "Next we create all of the scoped properties - which covers the majority of the data-model.",
    insert: `function normaliseID(raw, type){
    if(type == "id"){
        var bits = raw.split(":");
        return (bits.length > 1 ? raw : "scm:" + raw);
    }
    if(type == "type"){
        var bits = raw.split(":");
        if(bits.length > 1) {
            var nr = bits[1];
            return "scm:" + nr.charAt(0).toUpperCase() + nr.slice(1)  
        }
        else {
            return "scm:" +  raw.charAt(0).toUpperCase() + raw.slice(1);
        }
    }
    if(type == "parents"){
        var npars = [];
        if(Array.isArray(raw) && raw.length){
            for(var i = 0 ; i<raw.length; i++){
                var nr = raw[i].split(":");
                if(nr.length > 1) npars.push(nr);
                else {
                    npars.push("scm:" + nr);
                }
            }
        }
        return npars;
    }
    return raw;
}

function createScopedProperty(npid, nptype, parents, label, description, domain){
    domain = domain || "scm:PoliticalAuthority";
    parents = normaliseID(parents, "parents");
    parents.push("scm:ScopedValue");
    npid = normaliseID(npid, "id");
    nptype = normaliseID(nptype, "type");
    parents.push(nptype);
    let newclass = npid + "_Value";
    return WOQL.and(
        WOQL.add_class(newclass)
            .label(label)
            .description(description)
            .parent(...parents),
        WOQL.add_property(npid, newclass)
            .label(label)
            .description(description)
            .domain(domain)
    );
}



WOQL.when(true, WOQL.and(
    createScopedProperty("longest_communication_distance", "xdd:integerRange", ["Scale", "SocialComplexity"], 
        "Longest Communication Distance", 
        \`Distance in kilometers between the capital and the furthest provincial capital. 
         The figure for the most direct land and/or sea route that was available is used.
         <p>As an alternative for prehistoric communities, it refers to the distance between 
         largest quasi-capital and furthest village within the quasi-polity.</p>\`),
    createScopedProperty("fastest_travel", "xdd:decimalRange", ["Transport"], 
        "Fastest Individual Communication", 
        \`This is the fastest time (in days) an individual can travel from the capital city 
         to the most outlying provincial capital (if one exists), usually keeping within the 
         boundaries of the polity. This might be by ship, horse, horse relay, or on foot, or a combination.\`),
    createScopedProperty("population", "xdd:integerRange", ["Scale", "SocialComplexity"], 
        "Population", 
        \`Estimated population; can change as a result of a political authority adding/losing 
         new territories or by population growth/decline within a region\`),
    createScopedProperty("capital_city", "xsd:string", ["SocialComplexity"], 
        "Capital City", 
        \`The city where the ruler spends most of his or her time. If there was more than one capital,
         all are included. Note that the capital may be different from the largest city (see below).
         <p>'Capital' may be difficult to code for archaeologically known societies.
         If there is reasonable basis to believe that the largest known settlement was 
         the seat of the ruler it is coded as capital.
         Archaeologists are able to recognize special architectural structures, 
         such as a ceremonial centres and some kind of citadels or palaces.
         These features could be recognized with certainty after a careful study of the 
         whole region and the settlement network.
         If such an inference cannot be made, this variable is coded as unknown 
        (again, the largest settlement is coded elsewhere).</p>\`),                     
    createScopedProperty("degree_of_centralization", "ScopedDegreeOfCentralization", ["SocialComplexity"], 
        "Degree of Centralization", 
        \`How centralized was power in this political authority?\`),                     
    createScopedProperty("largest_settlement_population", "xdd:integerRange", ["SocialComplexity", "Scale"], 
        "Largest Settlement Population", 
        \`Population count of the largest settlement within the entity. 
         <p>Note that the largest settlement could be different from the capital. 
         Where possible, the dynamics (that is, how population changed during the temporal period of the polity) 
         are included in the notes. 
         Note that we are also building a city database - this will be merged into that eventually.</p>\`),                     
    createScopedProperty("linguistic_family", "xsd:string", ["SocialComplexity", "Language"], 
        "Linguistic Family", 
        \`The Linguistic family or families that the main languages
         belonged to. https://en.wikipedia.org/wiki/List_of_language_families\`),
    createScopedProperty("alternative_names", "xsd:string", [], 
        "Alternative names", 
        \`Names used in the historical literature or common names used by the inhabitants\`),
    createScopedProperty("territorial_area", "xdd:integerRange", [], 
        "Territorial Area", 
        \`The area in squared kilometers of the entity's territory.\`),
    createScopedProperty("utm_zone", "xsd:string", [], 
        "UTM Zone", 
        \`The UTM Zone that corresponds most directly with the entity - e.g. 
         where the polity's capital city is located, or the location of the NGA. 
         For more see: http://www.dmap.co.uk/utmworld.htm\`),
    createScopedProperty("lang", "xsd:string", ["Language"], 
        "Language", 
        \`The language(s) are listed that were generally used for administration, religion, and military affairs. 
        The languages spoken by the majority of the population are also listed, if different from the above.\`),
    createScopedProperty("peak", "xdd:integerRange", [], 
        "Peak Date", 
        \`The period when the political power was at its peak, whether militarily,
        in terms of the size of territory controlled, or the degree of cultural development. 
        This variable has a subjective element, but typically historians agree when the peak was.\`),
    createScopedProperty("centralization", "ScopedDegreeOfCentralization", ["InternalAffairs"], 
         "Degree of Centralization", 
         \`How centralized was power in this political authority?\`),
    createScopedProperty("supra_polity_relations", "ScopedSupraPolityRelations", ["ExternalAffairs"], 
         "Supra-polity relations", 
         \`What was the relationship between this political authority and larger / higher order power.\`),
    createScopedProperty("predecessor_relationship", "ScopedPoliticalEvolution", [], 
         "Relationship to Preceding Polity", 
         \`How this political authority evolved from its predecessor.\`),
    createScopedProperty("supracultural_entity", "xsd:string", ["ExternalAffairs"], 
         "Supra-cultural Entity", 
         \`Political Authorities can be embedded within larger-scale cultural groupings 
          of polities or quasipolities. These are sometimes referred to as \"civilizations\". 
          For example, medieval European kingdoms were part of Latin Christendom. During the periods of 
          disunity in China, warring states there, nevertheless, belonged to the same Chinese cultural sphere. 
          Archaeologists often use \"archaeological traditions\" to denote such large-scale cultural entities 
          (for example, Peregrine's Atlas of Cultural Evolution). 
          Note, 'supracultural entity' refers to cultural interdependence, and is distinct 
          from a political confederation or alliance, which is coded under 'supra-polity relations.'\`),
    createScopedProperty("supracultural_scale", "xdd:integerRange", ["Scale"], 
         "Supra-cultural Scale", 
         \`An estimate of the area encompassed by the supracultural entity - in km squared.\`),
    createScopedProperty("monetary_articles", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Articles", 
        \`Articles with use-value used for exchange and trade, e.g. axes, cattle, grain.\`),                     
    createScopedProperty("debt_and_credit", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Debt and credit", 
        \`Commercial and market debt and credit structures that take physical form, 
        e.g. a contract on parchment (not just verbal agreements)\`),
    createScopedProperty("foreign_coins", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Foreign Coins", 
        \`Coins minted by some external polity are used for exchange\`),
    createScopedProperty("indigenous_coins", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Indigenous Coins", 
        \`Coins minted by local authority are in use for exchange\`),
    createScopedProperty("paper_currency", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Paper Currency", 
        \`Currency notes or other kind of fiat currency\`),
    createScopedProperty("precious_metals", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Precious Metals", 
        \`Bullion: non-coined silver, gold, platinum.\`),
    createScopedProperty("stores_of_wealth", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Stores of Wealth", 
        \`Special places for storing wealth: (example: hoard, chest for storing valuables, treasury room). 
        Note for the future: perhaps should separate these into individual variables.\`),
    createScopedProperty("monetary_tokens", "ScopedEpistemicState", ["MonetarySystem", "SocialComplexity"], 
        "Tokens",   
        \`Tokens used for exchange and trade, e.g. cowrie shells.\`),
    createScopedProperty("courts", "ScopedEpistemicState", ["Legal", "SocialComplexity"], 
        "Courts", 
        \`Encodes the historical presence of buildings specialized for legal proceedings only.\`),
    createScopedProperty("formal_legal_code", "ScopedEpistemicState", ["Legal", "SocialComplexity"], 
        "Formal Legal Code", 
        \`Codes the historical presence of a formal legal code. Usually, 
        but not always written down. If not written down, it is coded as 'present' 
        when a uniform legal system is established by oral transmission 
        (e.g., officials are taught the rules, or the laws are announced in a public space).\`),
    createScopedProperty("judges", "ScopedEpistemicState", ["Legal", "SocialComplexity"], 
        "Judges", 
        \`Codes the historical presence of specialist judges\`),
    createScopedProperty("professional_lawyers", "ScopedEpistemicState", ["Legal", "SocialComplexity"], 
        "Professional Lawyers", 
        \`Encodes the historical presence of specialist professional lawyers.\`),
    createScopedProperty("cost", "xdd:decimalRange", ["Scale", "SocialComplexity"], 
        "Cost", 
        \`cost in people-years.\`, "Building"),
    createScopedProperty("extent", "xdd:decimalRange", ["Scale", "SocialComplexity"], 
        "Extent", 
        \`Length of building along longest axis in metres\`, "Building"),
    createScopedProperty("height", "xdd:decimalRange", ["Scale", "SocialComplexity"], 
        "Height", 
        \`Height of building in metres\`, "Building"),
    createScopedProperty("administrative_levels", "xdd:integerRange", ["HierarchicalComplexity"], 
        "Administrative Levels", 
        \`Number of levels in the administrative hierarchy. 
        <p>An example of hierarchy for a state society could be 
        (5) the overall ruler, (4) provincial/regional governors, 
        (3) district heads, (2) town mayors, (1) village heads. 
        Note that unlike in settlement hierarchy, the people hierarchy is coded here. </p> 
        <p>Archaeological polities are usually coded as 'unknown', unless experts can 
        identified ranks of chiefs or officials independently of the settlement hierarchy.</p>
        <p>Note: Often there are more than one concurrent administrative hierarchy. 
        In the example above the hierarchy refers to the territorial government. 
        In addition, the ruler may have a hierarchically organized central 
        bureaucracy located in the capital. For example, 
        (4)the overall ruler, (3) chiefs of various ministries, 
        (2) mid-level bureaucrats, (1) scribes and clerks. 
        In the narrative paragraph detail what is known about both hierarchies. 
        The machine-readable code should reflect the largest number (the longer chain of command). </p>\`),
    createScopedProperty("military_levels", "xdd:integerRange", ["HierarchicalComplexity"], 
        "Military Levels", 
        \`Number of levels in the military hierarchy. 
        <p>Starts with the commander-in-chief and works down to the private (level 1).</p> 
        <p>Even in primitive societies such as simple chiefdoms it is often possible to 
        distinguish at least two levels : a commander and soldiers.
        A complex chiefdom would be coded as having three levels.
        The presence of warrior burials might be the basis for inferring the existence of a military organization. 
        (The lowest military level is always the individual soldier).</p>\`),
    createScopedProperty("religious_levels", "xdd:integerRange", ["HierarchicalComplexity"], 
        "Religious Levels", 
        \`Number of levels in the religious hierarchy.
         <P>Starts with the head of the official cult 
        (if present) and works down to the local priest (level 1).</p>\`),
    createScopedProperty("settlement_levels", "xdd:integerRange", ["HierarchicalComplexity"], 
        "Settlement Levels", 
        \`This variable records the hierarchy of not just settlement sizes, 
         but also their complexity as reflected in different roles they play within the (quasi)polity.
         As settlements become more populous they acquire more complex functions: transportational 
         (e.g. port); economic (e.g. market); administrative (e.g. storehouse, local government building); 
         cultural (e.g. theatre); religious (e.g. temple), utilitarian (e.g. hospital), monumental 
         (e.g. statues, plazas). <p>Example: (6) Large City 
         (monumental structures, theatre, market, hospital, central government buildings) 
         (5) City (market, theatre, regional government buildings) 
         (4) Large Town (market, administrative buildings)
         (3) Town (administrative buildings, storehouse)) (2) Village (shrine) 
         (1) Hamlet (residential only).</p> <p>In the narrative annotations, the different levels and 
         their functions are listed. A Crude estimate of population sizes is included.
         For example, Large Town (market, temple, administrative buildings): 2,000-5,000 inhabitants. </p>\`),
    createScopedProperty("bureaucrat_income_source", "ScopedIncomeSource", ["Public", "BureaucraticSystem"], 
        "Bureaucrat Income Source", 
        \`Encodes the primary sources of income for professional bureaucrats / administrators\`),
    createScopedProperty("examination_system", "ScopedEpistemicState", ["Public", "BureaucraticSystem"], 
        "Examination System", 
        \`Codes the presence of an official Examination System. 
        The paradigmatic example is the Chinese imperial system.\`),
    createScopedProperty("full_time_bureaucrats", "ScopedEpistemicState", ["Public", "BureaucraticSystem"], 
        "Full-time Bureaucrats", 
        \`Codes the presence of full-time specialist bureaucratic officials.\`),
    createScopedProperty("government_buildings", "ScopedEpistemicState", ["BureaucraticSystem", "Public", "Infrastructure"], 
        "Government Buildings", 
        \`Codes the historical presence of specialized government administration buildings. 
        These buildings are distinct from the ruler's palace and could be used for document storage, 
        registration offices, minting money, etc. 
        Defense structures also are not included here.\`),
    createScopedProperty("merit_promotion", "ScopedEpistemicState", ["BureaucraticSystem", "Public"], 
        "Merit Promotion", 
        \`Codes the historical presence of merit promotion. <i>Present</i> means there were regular, 
        institutionalized procedures for promotion based on performance. When exceptional 
        individuals are promoted to the top ranks, in the absence of 
        institutionalized procedures, this does not count (it is encoded elsewhere).\`),
    createScopedProperty("military_officers", "ScopedEpistemicState", ["Professions", "Military"], 
        "Military Officers", 
        \`Full-time specialist military officers.\`),
    createScopedProperty("professional_soldiers", "ScopedEpistemicState", ["Professions", "Military"], 
        "Soldiers", 
        \`Full-time specialist paid soldiers.\`),
    createScopedProperty("priests", "ScopedEpistemicState", ["Professions", "Religion"], 
        "Priesthood", 
        \`Codes the presence of full-time specialist religious officials.\`),
    createScopedProperty("bureaucrats", "ScopedEpistemicState", ["Professions", "BureaucraticSystem"], 
        "Full-time Bureaucrats", 
        \`Codes the presence of full-time specialist bureaucratic officials.\`),
    createScopedProperty("public_buildings", "ScopedEpistemicState", ["Public", "SpecializedBuildings"], 
        "Communal Buildings", 
        \`This encodes the historical presence of Communal buildings. It distinguishes between 
        settlements that consist of only private households (coded 'absent') and settlements 
        where there are communal buildings which could be used for a variety of uses (coded 'present').\`),
    createScopedProperty("special_houses", "ScopedEpistemicState", ["SpecializedBuildings"], 
        "Special Purpose Houses", 
        \`Encodes the historical presence of houses that were used in
         a distinctive or special manner. This code reflects differentiation between houses.\`),
    createScopedProperty("symbolic_building", "ScopedEpistemicState", ["SpecializedBuildings"], 
        "Symbolic Buildings", 
        \`Encodes the historical presence of specialized purely symbolic buildings. 
        <P>These are non-utilitarian constructions that display symbols, or are themselves 
        symbols of the community or polity (or a ruler as a symbol of the polity). 
        Examples include Taj Mahal mausoleum, Trajan's Column, Ashoka's Pillars, Qin Shih Huang's Terracota Army, 
        the Statue of Liberty. Has to be constructed by humans, so sacred groves or mountains 
        are not symbolic buildings. A palace is also not a symbolic building, because it has other, 
        utilitarian functions (houses the ruler).</P>\`),
    createScopedProperty("fun_houses", "ScopedEpistemicState", ["SpecializedBuildings", "Entertainment"], 
        "Entertainment Buildings", 
        \`Encodes the historical presence of specialist entertainment buildings. These include theaters, arenas, race tracks.\`),
    createScopedProperty("libraries", "ScopedEpistemicState", ["SpecializedBuildings",  "Writing"], 
        "Knowledge / Information Buildings", 
        \`Encodes the historical presence of specialist information / knowledge buildings. 
        These include astronomic observatories, libraries, and museums.\`),
    createScopedProperty("utilities", "ScopedEpistemicState", ["SpecializedBuildings", "Infrastructure"], 
        "Utilitarian Public Buildings", 
        \`Encodes the historical presence of public utilities. Typical examples include aqueducts, 
        sewers, and granaries (which are also included as separate variables). In the narrative annotations, 
        examples of utilitarian buildings and the most impressive/costly/large ones are included.\`),
    createScopedProperty("emporia", "ScopedEpistemicState", ["SpecializedBuildings"], 
        "Trading Emporia", 
        \`Encodes the historical presence of trading settlements characterised by their peripheral locations, 
        on the shore at the edge of a polity, a lack of infrastructure (typically those in Europe contained no churches) 
        and often of a short-lived nature. They include isolated caravanserai along trade routes.\`),
    createScopedProperty("enclosures", "ScopedEpistemicState", ["SpecializedBuildings"], 
        "Enclosure", 
        \`Encodes the historical presence of 'enclosures': a clearly demarcated special-purpose area. 
        It can be separated from surrounding land by earthworks (including banks or ditches), walls, 
        or fencing. It may be as small as a few meters across, or encompass many hectares. It is non-residential,
        but could serve numerous purposes, both practical (animal pens) as well as religious and ceremonial.\`),
    createScopedProperty("other_site", "ScopedEpistemicState", ["SpecializedBuildings"], 
         "Other Site", 
         \`Encodes the historical presence of specialised non-residential sites. 
         A description of the site is provided in the notes.\`),
    createScopedProperty("roads", "ScopedEpistemicState", ["Transport"], 
        "Roads", 
        \`Encodes the historical presence of roads that were either built or 
        maintained by the political authority.\`),
    createScopedProperty("bridges", "ScopedEpistemicState", ["Transport"], 
        "Bridges", 
        \`Encodes the historical presence of bridges that were either built or
        maintained by the political authority.\`),
    createScopedProperty("canals", "ScopedEpistemicState", ["Transport"], 
        "Canals", 
        \`Encodes the historical presence of canals or artificial waterways 
        that were built or maintained by the political authority.\`),
    createScopedProperty("ports", "ScopedEpistemicState", ["Transport", "Naval"], 
        "Ports", 
        \`Encodes the historical presence of ports that were either built or maintained by the political authority. 
        These include river ports. Direct historical or archaeological evidence of Ports is absent 
        when no port has been excavated or all evidence of such has been obliterated. Indirect historical 
        or archaeological data is absent when there is no evidence that suggests that the polity engaged
        in maritime or riverine trade, conflict, or transportation, such as evidence of merchant shipping, 
        administrative records of customs duties, or evidence that at the same period of time a trading 
        relation in the region had a port (for example, due to natural processes, there is little evidence
        of ancient ports in delta Egypt at a time we know there was a timber trade with the Levant). 
        When evidence for the variable itself is available the code is 'present.' When other forms of evidence 
        suggests the existence of the variable (or not) the code may be 'inferred present' (or 'inferred absent').
        When indirect evidence is <i>not</i> available the code will be either absent, 
        temporal uncertainty, suspected unknown, or unknown.\`),
    createScopedProperty("length_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Length", 
        \`Encodes the historical presence of a standard way of measuring length. 
        For example: feet, miles, kilometers, inches\`),
    createScopedProperty("area_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Area", 
        \`Encodes the historical presence of a standard way of measuring areas. 
        For example: squared feet, hectares\`),
    createScopedProperty("volume_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Volume", 
        \`Encodes the historical presence of a standard way of measuring volume. For example: pint, litre\`),
    createScopedProperty("weight_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Weight", 
        \`Encodes the historical presence of a standard way of measuring weight. For example: pounds, kilograms\`),
    createScopedProperty("time_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Time", 
        \`Encodes the historical presence of a standard way of measuring time.
         A natural unit such as 'day' doesn't qualify. 
        Nor does a vague one like 'season'. Archaeological evidence is a clock (e.g., sundial)\`),
    createScopedProperty("geometrical_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Geometrical", 
        \`Encodes the historical presence of a standard way of measuring geometries - for example: degrees.\`),
    createScopedProperty("advanced_unit", "ScopedEpistemicState", ["MeasurementSystem"], 
        "Other", 
        \`More advanced measurements: temperature, force, astronomical.\`),
    createScopedProperty("mnemonics", "ScopedEpistemicState", ["WritingSystem"], 
        "Mnemonic Devices", 
        \`Marks that serve as memory devices that help people recall larger pieces of information\`),
    createScopedProperty("non_written_records", "ScopedEpistemicState", ["WritingSystem"], 
        "Non-written Records", 
        \`Knoweldge representation systems that do not use writing - using color, material, etc to convey meaning. e.g., quipu https://en.wikipedia.org/wiki/Quipu\`),
    createScopedProperty("script", "ScopedEpistemicState", ["WritingSystem"], 
        "Script", 
        \`A system for writing symbols that have meaning attached to them. 
        (note that if written records are present, then so is script by defintion)\`),
    createScopedProperty("written_records", "ScopedEpistemicState", ["WritingSystem"], 
        "Written Records", 
        \`More than short and fragmentary inscriptions, such as found on tombs or runic stones. 
        There must be several sentences strung together, at the very minimum. For example, 
        royal proclamations from Mesopotamia and Egypt qualify as written records;\`),
    createScopedProperty("non_phonetic", "ScopedEpistemicState", ["WritingSystem"], 
        "Non-phonetic Writing", 
        \`this refers to the kind of script - non-phonetic scripts do not represent the sound of 
        the word but attach symbols to the meaning.\`),
    createScopedProperty("phonetic", "ScopedEpistemicState", ["WritingSystem"], 
        "Phonetic Alphabet", 
        \`this refers to the kind of script - phonetic scripts have alphabets 
        with letters and combinations of letters which represent sounds.\`),
    createScopedProperty("lists", "ScopedEpistemicState", ["WritingGenre"], 
        "Lists and Tables", 
        \`Written lists, tables and classifications (e.g. debt lists, tax-lists...)\`),
        createScopedProperty("calendar", "ScopedEpistemicState", ["WritingGenre"], 
        "Calendar", 
        \`Written calendar or dating system\`),
    createScopedProperty("sacred_texts", "ScopedEpistemicState", ["WritingGenre", "Religion"], 
        "Sacred Texts", 
        \`Sacred Texts originate from supernatural agents (deities), or are directly inspired by them.\`),
    createScopedProperty("religious_literature", "ScopedEpistemicState", ["WritingGenre", "Religion"], 
        "Religious Literature", 
        \`Religious literature differs from the sacred texts. For example, it may provide commentary 
        on the sacred texts, or advice on how to live a virtuous life.\`),
    createScopedProperty("manuals", "ScopedEpistemicState", ["WritingGenre"], 
        "Practical Literature", 
        \`Practical guides and manuals to help people do useful stuff. 
        For example manuals on agriculture, military, cooking, etc\`),
    createScopedProperty("history", "ScopedEpistemicState", ["WritingGenre"], 
        "History", 
        \`Written history existed\`),
    createScopedProperty("philosophy", "ScopedEpistemicState", ["WritingGenre"], 
        "Philosophy", 
        \`Written philosophical treatises\`),
    createScopedProperty("science", "ScopedEpistemicState", ["WritingGenre", "Science"], 
        "Science", 
        \`Written scientific works, including mathematics, natural sciences, social sciences\`),
    createScopedProperty("fiction", "ScopedEpistemicState", ["WritingGenre"], 
        "Fiction", 
        \`Written fictional works - including poetry, novels, short-stories, etc 
        (poetry will be factored out in future versions of the codebook.\`),
    createScopedProperty("couriers", "ScopedEpistemicState", ["PostalSystem"], 
        "Couriers", 
        \`Full-time professional couriers.\`),
    createScopedProperty("post_offices", "ScopedEpistemicState", ["PostalSystem", "SpecializedBuildings"], 
        "Postal Stations", 
        \`Specialized buildings exclusively devoted to the postal service.\`),
    createScopedProperty("private_mail", "ScopedEpistemicState", ["PostalSystem"], 
        "General Service", 
        \`A postal service that not only serves the ruler's needs, but carries mail for private citizens.\`),
    createScopedProperty("fortifications", "ScopedEpistemicState", ["Military", "Infrastructure", "Resilience"], 
        "Fortifications", 
        \`IV-5-7. Fortifications.\`),
    createScopedProperty("sewage", "ScopedEpistemicState", ["Infrastructure", "Resilience"], 
        "Sewage", 
        \`IV-5-4. Sewage management systems\`),
    createScopedProperty("irrigation", "ScopedEpistemicState", ["Infrastructure", "Public"], 
        "Irrigation Systems", 
        \`Encodes the historical presence of irrigation systems.\`),
    createScopedProperty("potable_water", "ScopedEpistemicState", ["Infrastructure", "Public"], 
        "Drinking Water Supply", 
        \`Encodes the historical presence of systems to supply drinking water to the public.\`),
    createScopedProperty("markets", "ScopedEpistemicState", ["Infrastructure"], 
        "Markets", 
        \`Encodes the historical presence of markets.\`),
    createScopedProperty("siloes", "ScopedEpistemicState", ["Infrastructure", "Construction", "Food"], 
        "Food Storage Sites", 
        \`The historical presence of specialized structures (grain siloes...) for storing food.\`),
    createScopedProperty("special_sites", "ScopedEpistemicState", ["Infrastructure"], 
        "Special Sites", 
        \`The types of special sites that are associated with the polity - 
        primarily useful for coding archaneologically known societies.\`),
    createScopedProperty("ceremonial_sites", "ScopedEpistemicState", ["Ritual", "Infrastructure"], 
        "Ceremonial Site", 
        \`Encodes the historical presence of sites that were specifically used for ceremonies.\`),
    createScopedProperty("burial_sites", "ScopedEpistemicState", ["Burial", "Infrastructure"], 
        "Burial Site", 
        \`Encodes the historical presence of burial sites, dissociated 
        from settlement habitation, with monumental features.\`),
    createScopedProperty("mines", "ScopedEpistemicState", ["Mining", "Infrastructure"], 
        "Mine or Quarry", 
        \`Encodes the historical presence of mines or quarries within the political authority.\`),
        createScopedProperty("irrigation", "ScopedEpistemicState", ["Infrastructure", "Public"], 
        "Irrigation Systems", 
        \`Encodes the historical presence of irrigation systems.\`),
    createScopedProperty("potable_water", "ScopedEpistemicState", ["Infrastructure", "Public"], 
        "Drinking Water Supply", 
        \`Encodes the historical presence of systems to supply drinking water to the public.\`),
    createScopedProperty("markets", "ScopedEpistemicState", ["Infrastructure"], 
        "Markets", 
       \`Encodes the historical presence of markets.\`),
    createScopedProperty("siloes", "ScopedEpistemicState", ["Infrastructure", "Construction", "Food"], 
        "Food Storage Sites", 
        \`The historical presence of specialized structures (grain siloes...) for storing food.\`),
    createScopedProperty("special_sites", "ScopedEpistemicState", ["Infrastructure"], 
        "Special Sites", 
        \`The types of special sites that are associated with the polity - 
        primarily useful for coding archaneologically known societies.\`),
    createScopedProperty("ceremonial_sites", "ScopedEpistemicState", ["Ritual", "Infrastructure"], 
        "Ceremonial Site", 
        \`Encodes the historical presence of sites that were specifically used for ceremonies.\`),
    createScopedProperty("burial_sites", "ScopedEpistemicState", ["Burial", "Infrastructure"], 
        "Burial Site", 
        \`Encodes the historical presence of burial sites, dissociated 
        from settlement habitation, with monumental features.\`),
    createScopedProperty("mines", "ScopedEpistemicState", ["Mining", "Infrastructure"], 
        "Mine or Quarry", 
        \`Encodes the historical presence of mines or quarries within the political authority.\`),    
))`,
query: `WOQL.select("v:Domain", "v:Property", "v:Range_Type", "v:Topic").and(
    WOQL.quad("scm:professional_soldiers", "label", "v:Property", "schema" ),
    WOQL.quad("scm:professional_soldiers", "domain", "v:Domain", "schema" ),
    WOQL.quad("scm:professional_soldiers", "range", "v:Range_Type", "schema" ),
    WOQL.opt().quad("v:Range_Type", "v:Property_2", "v:Value", "schema" ),
    WOQL.opt().quad("v:Range_Type", "subClassOf", "v:Topic", "schema" )
)`
}

stages.push(q15);

let q16 = {
    text: "Now we import the property data itself - this involves mapping the old property names to new property names and correcting some errors on the way",
    insert: `getOriginalProperty = function(type){
    if(type.indexOf(":") != -1) type = type.split(":")[1];
    if(["string", "gYearRange", "integerRange", "decimalRange"].indexOf(type) != -1) return "http://dacura.scss.tcd.ie/ontology/dacura#"+ type;
    return "http://dacura.scss.tcd.ie/seshat/ontology/seshat#" + type;
}

valueType = function(type){
    if(type.indexOf(":") != -1) type = type.split(":")[1];
    if(["string"].indexOf(type) != -1) return "xsd:" + type;
    if(["gYearRange", "integerRange", "decimalRange"].indexOf(type) != -1) return "xdd:" + type;
    return false
}

getOriginalBoxProperty = function(type){
    let map = {
        EpistemicState: "hasEpistemicStateChoice",
        EpistemicFrequency: "hasEpistemicFrequencyChoice",
        LeaderIdentification: "leader_identification_choice",
        LeaderDifferentiation: "leader_differentiation_type",
        AuthorityEmphasis: "authority_emphasis_choice",
        Standardization: "has_standardization",
        Change: "has_change_size",
        ComplexityChange: "community_size_change", 
        GodType: "hasGodTypeChoice",
        Frequency: "hasFrequencyChoice",
        ExternalContact: "external_contact_choice"
    }
    var ext = (map[type] ? map[type] : type);
    return "http://dacura.scss.tcd.ie/seshat/ontology/seshat#" + ext; 
}


transparentValueMap = function(oprop, vtarg, vval){
    oprop = oprop || "Transparent";
    vtarg = vtarg || "v:Target";
    vval = vval || "v:Value"
    return WOQL.and(
        WOQL.re("#(.*)", vtarg, ["v:All"+oprop,"v:Match" + oprop]),
        WOQL.idgen("scm:", ["v:Match" + oprop], vval)
    )
}

generateValueMap = function(vmap, def, vtarg){
    vtarg = vtarg || "v:Target";
    var defcond = [];
    var clauses = []
    for(var k in vmap){
        let clause = [
            WOQL.eq(vtarg, k),
            WOQL.idgen("scm:", [vmap[k]], "v:Value")
        ];
        defcond.push(WOQL.not().eq(vtarg, k));
        clauses.push(WOQL.and(...clause));
    }
    if(def){
        defcond.push(def);
        clauses.push(WOQL.and(...defcond));
    }
    return WOQL.or(...clauses);
}

processPropertyData = function(oprop, pmapdata, vmap){
    let newprop = (pmapdata && pmapdata[0]) ? pmapdata[0] : oprop; 
    var type = (pmapdata && pmapdata[1]) ? pmapdata[1] : "EpistemicState";
    var origprop = "http://dacura.scss.tcd.ie/seshat/ontology/seshat#" + oprop;
    let valtype = valueType(type);
    if(valtype){
        var origprop2 = (pmapdata && pmapdata[2] ? pmapdata[2] : getOriginalProperty(type));
        var newprop2 = "scm:" + valtype.split(":")[0];
        var valgen = vmap || WOQL.typecast("v:Target", valtype, "v:Value");
    }
    else {
        var origprop2 = (pmapdata && pmapdata[2] ? pmapdata[2] : getOriginalBoxProperty(type));
        var newprop2 = type.charAt(0).toLowerCase() + type.slice(1);
        var valgen = vmap || (transparentValueMap(oprop));
    }
    return getImportScopedPropertyWOQL(origprop, origprop2, newprop, newprop2, valgen);
}

getImportScopedPropertyWOQL = function(origprop1, origprop2, newprop, newprop2, value_generator, graph){
    let valtype = newprop + "_Value";
    graph = graph || "graph://temp";

    const inserts = WOQL.when(
        WOQL.and(
			WOQL.quad("v:AID","v:First_Pred","v:Join",graph),
			WOQL.quad("v:Join","v:Second_Pred","v:Target",graph),
			WOQL.re(".*/candidate/(\\w*)","v:AID",["v:AID_ALL","v:AID_Match"]),
			WOQL.idgen("doc:",["v:AID_Match"], "v:DocID"),
            WOQL.idgen("http://dacura.scss.tcd.ie/seshat/ontology/seshat#", [origprop1], "v:Original_Property"),
            WOQL.eq("v:First_Pred", "v:Original_Property"),
            WOQL.eq("v:Second_Pred", origprop2),
            WOQL.idgen("scm:", [newprop2], "v:Pseudo_Property"),
            WOQL.idgen("scm:", [newprop], "v:New_Property"),
            WOQL.idgen("scm:", [valtype], "v:Value_Type"),
            value_generator,
            WOQL.unique("doc:", ["v:Join"], "v:Value_ID"),
        ), WOQL.and(
            WOQL.add_triple("v:DocID", "v:New_Property", "v:Value_ID"),
            WOQL.add_triple("v:Value_ID", "rdf:type", "v:Value_Type"),
            WOQL.add_triple("v:Value_ID", "v:Pseudo_Property", "v:Value")
        )
    );
    return inserts;
}


let property_map = {
  "alternativeNames": ["alternative_names", "string"],
  "utmZone": ["utm_zone", "string"],
  "settlementLevels": ["settlement_levels", "integerRange"],
  "adminLevels": ["administrative_levels", "integerRange"],
  "religiousLevels": ["religious_levels", "integerRange"],
  "militaryLevels": ["military_levels", "integerRange"],
  "language": ["lang", "string"],
  "capital": ["capital_city", "string"],
  "population": [false, "integerRange"],
  "territorialArea": ["territorial_area", "integerRange"],
  "largestSettlement": ["largest_settlement_population", "integerRange"],
  "linguisticFamily": ["linguistic_family", "string"],
  "fastestTravel": ["fastest_travel", "decimalRange"],
  "supraculturalEntity": ["supracultural_entity"],
  "longestCommunication": ["longest_communication_distance", "integerRange"],
  "supraculturalScale": ["supracultural_scale", "integerRange"],
  "bureaucratsIncome": ["bureaucrat_income_source", "IncomeSource"],
  "supraRelations": ["supra_polity_relations", "SupraPolityRelations"],
  "predecessorChange": ["predecessor_relationship", "PoliticalEvolution"],
  "centralization": [false, "DegreeOfCentralization"],          
  "peak": [false, "integerRange", "http://dacura.scss.tcd.ie/ontology/dacura#gYearRange"],      
  "professionalSoldiers": ["professional_soldiers"],
  "bureaucrats": [],
  "exams": ["examination_system"],
  "meritPromotion": ["merit_promotion"],
  "govBuildings": ["government_buildings"],
  "legalCode": ["formal_legal_code"],
  "judges": [],
  "courts": [],
  "priests": [],
  "lawyers": ["professional_lawyers"],
  "publicBuildings": ["public_buildings"],
  "specialHouses": ["special_houses"],
  "symbolicBuilding": ["symbolic_building"],
  "funHouses": ["fun_houses"],
  "libraries": [],
  "utilities": [],
  "irrigation": [],
  "potableWater": ["potable_water"],
  "markets": [],
  "siloes": [],
  "roads": [],
  "bridges": [],
  "canals": [],
  "ports": [],
  "specialSites": ["special_sites"],
  "ceremonialSites": ["ceremonial_sites"],
  "burialSites": ["burial_sites"],
  "emporia": [],
  "enclosures": [],
  "mines": [],
  "altSites": ["other_site"],
  "lengthUnit": ["length_unit"],
  "areaUnit": ["area_unit"],
  "volumeUnit": ["volume_unit"],
  "weightUnit": ["weight_unit"],
  "timeUnit": ["time_unit"],
  "geometricalUnit": ["geometrical_unit"],
  "advancedUnit": ["advanced_unit"],
  "mnemonics": [],
  "nonWritten": ["non_written_records"],
  "hasScript": ["script"],
  "writtenRecords": ["written_records"],
  "nonPhonetic": ["non_phonetic"],
  "phonetic": [],
  "hasLists": ["lists"],
  "hasCalendar": ["calendar"],
  "sacredTexts": ["sacred_texts"],
  "religiousLit": ["religious_literature"],   
  "manuals": [],
  "history": [],
  "philosophy": [],
  "science": [],
  "fiction": [],
  "articles": ["monetary_articles"],
  "tokens": ["monetary_tokens"],
  "preciousMetals": ["precious_metals"],
  "foreignCoins": ["foreign_coins"],
  "localCoins": ["indigenous_coins"],
  "paperMoney": ["paper_currency"],
  "debtNotes": ["debt_and_credit"],
  "wealthStores": ["stores_of_wealth"],
  "couriers": [],
  "postOffices": ["post_offices"],
  "privateMail": ["private_mail"],
  "supernaturalJustice": ["supernatural_justice"], 
  "supernaturalReciprocity": ["supernatural_reciprocity"], 
  "supernaturalLoyalty": ["supernatural_loyalty"]         
}

let value_maps = {
  DegreeOfCentralization: { no_centralisation: "no_centralization", unknown_centralisation: "unknown_centralization"}
}

let value_changes = {
  "peak": WOQL.typecast("v:Target", "xdd:integerRange", "v:Value")      
}


let parts = [];
for(var k in property_map){
    var vgen = false;
    if(property_map[k][2] && value_maps[property_map[k][2]]){
	    vgen = generateValueMap(value_maps[k], transparentValueMap(k));
    }
    if(value_changes[k]){
	    vgen = value_changes[k];
    }
    parts.push(processPropertyData(k, property_map[k], vgen))
}

WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
	WOQL.and(...parts)
)`,
    query: `WOQL.select("v:Polity", "v:Property", "v:Value").and(
        WOQL.triple("itrompr", "label", "v:Polity"),
        WOQL.triple("itrompr", "v:Property", "v:ValID"),
        WOQL.triple("v:ValID", "v:Prop2", "v:Value")
    )`
}

stages.push(q16);

let q17 = {
    text: "Next we import the scopings for the property values",
    insert: `WOQL.with("graph://temp", WOQL.${remote_or_file}("${rdf_source}", {"type":"turtle"}),
       WOQL.and( 
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotated_ID"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:LS_ID", "graph://temp"),
                    WOQL.quad("v:LS_ID", "http://dacura.scss.tcd.ie/ontology/dacura#start", "v:Start_Time", "graph://temp"),
                    WOQL.cast("v:Start_Time", "xdd:integerRange", "v:Start_Value", "graph://temp")    
                ),
                WOQL.add_triple("v:Subject_ID", "scm:start", "v:Start_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotated_ID"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#lifespan", "v:LS_ID", "graph://temp"),
                    WOQL.quad("v:LS_ID", "http://dacura.scss.tcd.ie/ontology/dacura#end", "v:End_Time", "graph://temp"),
                    WOQL.cast("v:End_Time", "xdd:integerRange", "v:End_Value", "graph://temp")
                ),
                WOQL.add_triple("v:Subject_ID", "scm:end", "v:End_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotated_ID"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#confidence", "v:Confidence", "graph://temp"),
                    WOQL.re("#(.*)", "v:Confidence", ["v:Allconf", "v:ConfCode"]),
                    WOQL.idgen("scm:", ["v:ConfCode"], "v:Conf_Value")
                ),
                WOQL.add_triple("v:Subject_ID", "scm:confidence", "v:Conf_Value")
            ),
            WOQL.when(
                WOQL.and(
                    WOQL.quad("v:Annotation", "http://dacura.scss.tcd.ie/ontology/dacura#annotates", "v:Annotated_ID", "graph://temp"),
                    WOQL.unique("doc:", ["v:Annotated_ID"], "v:Subject_ID"),
                    WOQL.triple("v:Subject_ID", "type", "scm:Polity"),
                    WOQL.quad("v:Annotation", "comment", "v:Comment", "graph://temp")
                ), WOQL.and(
                        WOQL.insert("v:ID_GEN", "scm:Note"),
                        WOQL.add_triple("v:ID_GEN", "rdfs:comment", "v:Comment"),
                        WOQL.add_triple("v:Subject_ID", "scm:notes", "v:ID_GEN")
                )
            )
        )
    )`,
    query: `WOQL.select("v:Polity", "v:Property", "v:Value", "v:From", "v:To", "v:Confidence").limit(50).and(
        WOQL.triple("doc:itrompr", "label", "v:Polity"),
        WOQL.triple("doc:itrompr", "v:Property", "v:ValID"),
        WOQL.triple("v:ValID", "type", "v:Value_Type"),
        WOQL.triple("v:ValID", "v:Prop2", "v:Value")
        WOQL.opt().triple("v:ValID", "start", "v:From"),
        WOQL.opt().triple("v:ValID", "end", "v:To"),
        WOQL.opt().triple("v:ValID", "confidence", "v:Confidence")
    )`
}

stages.push(q17);
