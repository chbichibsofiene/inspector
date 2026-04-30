import json
import random
import string

mdj_path = r'c:\Users\scsof\Downloads\Inspector_1-main\Inspector_1-main\diagram de class final.mdj'
output_path = r'c:\Users\scsof\Downloads\Inspector_1-main\Inspector_1-main\diagram de class final.mdj'

with open(mdj_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

def generate_id():
    return "AAAAAAG" + "".join(random.choices(string.ascii_letters + string.digits, k=13))

def create_attribute(name, type_name, parent_id):
    return {
        "_type": "UMLAttribute",
        "_id": generate_id(),
        "_parent": {"$ref": parent_id},
        "name": name,
        "visibility": "private",
        "type": type_name
    }

def create_operation(name, return_type, parent_id):
    op_id = generate_id()
    return {
        "_type": "UMLOperation",
        "_id": op_id,
        "_parent": {"$ref": parent_id},
        "name": name,
        "parameters": [
            {
                "_type": "UMLParameter",
                "_id": generate_id(),
                "_parent": {"$ref": op_id},
                "type": return_type,
                "direction": "return"
            }
        ]
    }

class_specs = {
    "User": {
        "attrs": [("id", "Long"), ("email", "String"), ("password", "String"), ("serialCode", "String"), ("role", "Role"), ("enabled", "boolean"), ("profileCompleted", "boolean"), ("createdAt", "LocalDateTime"), ("isMicrosoftConnected", "boolean"), ("profileImageUrl", "String")],
        "ops": [("onCreate", "void")]
    },
    "Personnel": {
        "attrs": [("id", "Long"), ("cin", "String"), ("firstName", "String"), ("lastName", "String"), ("recruitmentDate", "LocalDate"), ("serialCode", "String"), ("role", "Role")],
        "ops": []
    },
    "InspectorProfile": {
        "attrs": [("id", "Long"), ("firstName", "String"), ("lastName", "String"), ("rank", "InspectorRank"), ("subject", "Subject"), ("schoolLevel", "SchoolLevel"), ("phone", "String"), ("language", "String"), ("delegations", "List<Delegation>"), ("dependencies", "List<Dependency>"), ("departments", "List<Department>"), ("etablissements", "List<Etablissement>")],
        "ops": []
    },
    "TeacherProfile": {
        "attrs": [("id", "Long"), ("firstName", "String"), ("lastName", "String"), ("subject", "Subject"), ("phone", "String"), ("language", "String"), ("delegation", "Delegation"), ("dependency", "Dependency"), ("etablissement", "Etablissement")],
        "ops": []
    },
    "Activity": {
        "attrs": [("id", "Long"), ("title", "String"), ("description", "String"), ("startDateTime", "LocalDateTime"), ("endDateTime", "LocalDateTime"), ("type", "ActivityType"), ("location", "String"), ("guests", "List<TeacherProfile>"), ("isOnline", "boolean"), ("meetingUrl", "String"), ("isReminderSent", "boolean")],
        "ops": []
    },
    "ActivityReport": {
        "attrs": [("id", "Long"), ("title", "String"), ("observations", "String"), ("recommendations", "String"), ("score", "Integer"), ("importedPdf", "byte[]"), ("status", "ReportStatus"), ("createdAt", "LocalDateTime"), ("updatedAt", "LocalDateTime")],
        "ops": [("onCreate", "void"), ("onUpdate", "void")]
    },
    "Quiz": {
        "attrs": [("id", "Long"), ("title", "String"), ("subject", "Subject"), ("topic", "String"), ("questions", "List<QuizQuestion>"), ("createdAt", "LocalDateTime")],
        "ops": [("onCreate", "void")]
    },
    "QuizQuestion": {
        "name_alt": ["Quiz Questions"],
        "attrs": [("id", "Long"), ("questionText", "String"), ("type", "QuestionType"), ("options", "String"), ("correctAnswer", "String")],
        "ops": []
    },
    "QuizSubmission": {
        "name_alt": ["Quiz Submissions"],
        "attrs": [("id", "Long"), ("answers", "String"), ("score", "Integer"), ("evaluationText", "String"), ("trainingSuggestion", "String"), ("submittedAt", "LocalDateTime")],
        "ops": [("onSubmit", "void")]
    },
    "Course": {
        "attrs": [("id", "Long"), ("title", "String"), ("description", "String"), ("subject", "Subject"), ("status", "CourseStatus"), ("modules", "List<CourseModule>"), ("assignments", "List<CourseAssignment>"), ("createdAt", "LocalDateTime")],
        "ops": [("onCreate", "void"), ("onUpdate", "void")]
    },
    "CourseModule": {
        "attrs": [("id", "Long"), ("title", "String"), ("description", "String"), ("orderIndex", "Integer"), ("lessons", "List<CourseLesson>")],
        "ops": []
    },
    "CourseLesson": {
        "attrs": [("id", "Long"), ("title", "String"), ("type", "LessonType"), ("contentUrl", "String"), ("description", "String"), ("durationMinutes", "Integer"), ("orderIndex", "Integer")],
        "ops": []
    },
    "CourseAssignment": {
        "attrs": [("id", "Long"), ("assignedAt", "LocalDateTime")],
        "ops": [("onCreate", "void")]
    },
    "Delegation": {
        "attrs": [("id", "Long"), ("name", "String")],
        "ops": []
    },
    "Department": {
        "name_alt": ["Departement"],
        "attrs": [("id", "Long"), ("name", "String"), ("delegation", "Delegation")],
        "ops": []
    },
    "Dependency": {
        "attrs": [("id", "Long"), ("name", "String"), ("delegation", "Delegation")],
        "ops": []
    },
    "Etablissement": {
        "attrs": [("id", "Long"), ("name", "String"), ("schoolLevel", "SchoolLevel"), ("dependency", "Dependency")],
        "ops": []
    },
    "Notification": {
        "attrs": [("id", "Long"), ("message", "String"), ("isRead", "boolean"), ("createdAt", "LocalDateTime")],
        "ops": []
    },
    "TimetableSlot": {
        "name_alt": ["TimeTable Slots"],
        "attrs": [("id", "Long"), ("dayOfWeek", "DayOfWeek"), ("startTime", "LocalTime"), ("endTime", "LocalTime"), ("subject", "Subject"), ("classroom", "String"), ("level", "String")],
        "ops": []
    },
    "Conversation": {
        "attrs": [("id", "Long"), ("lastMessageTime", "LocalDateTime")],
        "ops": [("onCreate", "void")]
    },
    "Message": {
        "attrs": [("id", "Long"), ("content", "String"), ("timestamp", "LocalDateTime"), ("isRead", "boolean"), ("fileUrl", "String"), ("fileName", "String"), ("fileType", "String")],
        "ops": [("onCreate", "void")]
    }
}

def update_classes(obj):
    if isinstance(obj, dict):
        if obj.get('_type') == 'UMLClass':
            name = obj.get('name')
            spec = None
            for s_name, s_val in class_specs.items():
                if name == s_name or name in s_val.get("name_alt", []):
                    spec = s_val
                    obj['name'] = s_name # normalize name
                    break
            
            if spec:
                parent_id = obj['_id']
                obj['attributes'] = [create_attribute(n, t, parent_id) for n, t in spec['attrs']]
                obj['operations'] = [create_operation(n, t, parent_id) for n, t in spec['ops']]
                print(f"Updated class: {name} -> {obj['name']}")
                
        for v in obj.values():
            update_classes(v)
    elif isinstance(obj, list):
        for item in obj:
            update_classes(item)

update_classes(data)

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent='\t')
