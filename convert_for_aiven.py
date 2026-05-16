import re
import sys

def convert_sql(input_file, output_file):
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        print(f"Erreur : Le fichier {input_file} n'a pas été trouvé.")
        return

    # Add DROP TABLE statements
    tables = ['action_logs', 'activities', 'activity_guests', 'activity_reports', 'conversations', 'courses', 'course_assignments', 'course_lessons', 'course_modules', 'delegations', 'departments', 'dependencies', 'etablissements', 'inspections', 'inspector_profiles', 'lesson_progress', 'messages', 'notifications', 'personnel', 'profile_delegations', 'profile_departments', 'profile_dependencies', 'profile_etablissements', 'quizzes', 'quiz_assignments', 'quiz_questions', 'quiz_submissions', 'regions', 'teacher_profiles', 'timetable_slots', 'users']
    drops = 'SET FOREIGN_KEY_CHECKS = 0;\nDROP TABLE IF EXISTS ' + ', '.join(['`' + t + '`' for t in tables]) + ';\nSET FOREIGN_KEY_CHECKS = 1;\n\n'
    
    content = content.replace('SET time_zone = \'+00:00\';\n', 'SET time_zone = \'+00:00\';\n' + drops)

    def repl(match):
        table_name = match.group(1)
        body = match.group(2)
        
        pk = ''
        if table_name == 'activity_guests':
            pk = ',\n  PRIMARY KEY (`activity_id`, `teacher_profile_id`)'
        elif table_name == 'profile_delegations':
            pk = ',\n  PRIMARY KEY (`profile_id`, `delegation_id`)'
        elif table_name == 'profile_departments':
            pk = ',\n  PRIMARY KEY (`profile_id`, `department_id`)'
        elif table_name == 'profile_dependencies':
            pk = ',\n  PRIMARY KEY (`profile_id`, `dependency_id`)'
        elif table_name == 'profile_etablissements':
            pk = ',\n  PRIMARY KEY (`profile_id`, `etablissement_id`)'
        elif table_name == 'quiz_assignments':
            pk = ',\n  PRIMARY KEY (`quiz_id`, `teacher_id`)'
        else:
            pk = ',\n  PRIMARY KEY (`id`)'
            
        if pk == ',\n  PRIMARY KEY (`id`)':
            body = re.sub(r'(`id` bigint\(20\) NOT NULL)', r'\1 AUTO_INCREMENT', body)
            
        return f'CREATE TABLE `{table_name}` ({body}{pk}\n) ENGINE=InnoDB'

    # Add inline PRIMARY KEYs
    content = re.sub(r'CREATE TABLE `([^`]+)` \((.*?)\n\) ENGINE=InnoDB', repl, content, flags=re.DOTALL)

    # Remove ONLY the ADD PRIMARY KEY lines from ALTER TABLE statements
    content = re.sub(r'\s*ADD PRIMARY KEY \([^)]+\),?', '', content)
    # Also clean up any ALTER TABLE that became empty (e.g., ALTER TABLE `table` ;)
    content = re.sub(r'ALTER TABLE `[^`]+`\n\s*;', '', content)

    # Remove AUTO_INCREMENT MODIFY lines since we added it inline
    content = re.sub(r'--\n-- AUTO_INCREMENT pour la table `[^`]+`\n--\nALTER TABLE `[^`]+`\n\s+MODIFY `id` bigint\(20\) NOT NULL AUTO_INCREMENT.*?;', '', content, flags=re.DOTALL)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Succès ! Le fichier a été converti et sauvegardé sous {output_file}")
    print("Vous pouvez maintenant exécuter ce fichier sur votre base de données Aiven.")

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python convert_for_aiven.py <input.sql> <output.sql>")
    else:
        convert_sql(sys.argv[1], sys.argv[2])
