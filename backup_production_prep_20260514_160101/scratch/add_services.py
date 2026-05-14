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

def create_operation(name, params_list, return_type, parent_id):
    op_id = generate_id()
    params = []
    # Return parameter
    params.append({
        "_type": "UMLParameter",
        "_id": generate_id(),
        "_parent": {"$ref": op_id},
        "type": return_type,
        "direction": "return"
    })
    # Input parameters
    for p_name, p_type in params_list:
        params.append({
            "_type": "UMLParameter",
            "_id": generate_id(),
            "_parent": {"$ref": op_id},
            "name": p_name,
            "type": p_type
        })
        
    return {
        "_type": "UMLOperation",
        "_id": op_id,
        "_parent": {"$ref": parent_id},
        "name": name,
        "parameters": params
    }

service_specs = {
    "UserService": [
        ("register", [("request", "UserRequest")], "UserResponse"),
        ("findByEmail", [("email", "String")], "User"),
        ("completeProfile", [("userId", "Long"), ("role", "Role")], "void")
    ],
    "ActivityService": [
        ("createActivity", [("inspectorId", "Long"), ("request", "ActivityRequest")], "ActivityResponse"),
        ("updateActivity", [("id", "Long"), ("request", "ActivityRequest")], "ActivityResponse"),
        ("deleteActivity", [("id", "Long")], "void"),
        ("getTeacherActivities", [("userId", "Long")], "List<ActivityResponse>")
    ],
    "ReportService": [
        ("createReport", [("inspectorId", "Long"), ("request", "ReportRequest")], "ReportResponse"),
        ("getTeacherReports", [("teacherId", "Long")], "List<ReportResponse>"),
        ("exportToPdf", [("reportId", "Long")], "byte[]")
    ],
    "QuizService": [
        ("generateAIQuestions", [("topic", "String")], "List<Question>"),
        ("submitQuiz", [("teacherId", "Long"), ("quizId", "Long"), ("answers", "Map")], "ScoreResponse")
    ],
    "CourseService": [
        ("createCourse", [("inspectorId", "Long"), ("request", "CourseRequest")], "CourseResponse"),
        ("publishCourse", [("courseId", "Long")], "void"),
        ("markLessonComplete", [("teacherId", "Long"), ("lessonId", "Long")], "void")
    ],
    "MessengerService": [
        ("sendMessage", [("senderId", "Long"), ("recipientId", "Long"), ("content", "String")], "MessageResponse"),
        ("getConversations", [("userId", "Long")], "List<ConversationResponse>")
    ],
    "NotificationService": [
        ("sendNotification", [("recipientId", "Long"), ("title", "String")], "void"),
        ("markAsRead", [("id", "Long")], "void")
    ]
}

# We will add these services to the model if they don't exist, or update them.
# For simplicity, I'll update the existing entity classes with these "business methods" 
# or look for classes named "XService".

def find_or_create_class(parent_obj, class_name):
    for item in parent_obj.get('ownedElements', []):
        if item.get('_type') == 'UMLClass' and item.get('name') == class_name:
            return item
    # Create if not found
    new_class = {
        "_type": "UMLClass",
        "_id": generate_id(),
        "_parent": {"$ref": parent_obj['_id']},
        "name": class_name,
        "attributes": [],
        "operations": []
    }
    if 'ownedElements' not in parent_obj:
        parent_obj['ownedElements'] = []
    parent_obj['ownedElements'].append(new_class)
    return new_class

# Find the main model to add services
main_model = data['ownedElements'][0] # Usually the UMLModel

for svc_name, ops in service_specs.items():
    svc_class = find_or_create_class(main_model, svc_name)
    svc_class['operations'] = [create_operation(name, params, ret, svc_class['_id']) for name, params, ret in ops]
    print(f"Updated Service: {svc_name}")

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent='\t')
