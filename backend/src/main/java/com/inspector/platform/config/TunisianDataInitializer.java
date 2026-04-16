package com.inspector.platform.config;

import com.inspector.platform.entity.*;
import com.inspector.platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TunisianDataInitializer implements CommandLineRunner {

    private final DelegationRepository delegationRepository;
    private final DependencyRepository dependencyRepository;
    private final DepartmentRepository departmentRepository;
    private final EtablissementRepository etablissementRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting Tunisian Data Seeding...");

        try {
            seedDelegationsAndDepartments();
            seedUsers();
            log.info("Seeding completed successfully!");
        } catch (Exception e) {
            log.error("Seeding failed: {}", e.getMessage(), e);
        }
    }

    private void seedDelegationsAndDepartments() {
        // Tunis 1
        Delegation tunis1 = createDelegation("Tunis 1");
        createDepartment("Inspection Générale Tunis 1", tunis1);
        createDepartment("Service des Examens Tunis 1", tunis1);
        Dependency drtunis1 = createDependency("Direction Régionale Tunis 1", tunis1);
        createEtablissement("Lycée Pilote Bourguiba", SchoolLevel.SECONDARY, drtunis1);
        createEtablissement("Collège Sadiki", SchoolLevel.PREPARATORY, drtunis1);
        createEtablissement("Ecole Primaire Rue de Marseille", SchoolLevel.PRIMARY, drtunis1);

        // Ariana
        Delegation ariana = createDelegation("Ariana");
        createDepartment("Inspection Ariana", ariana);
        Dependency drAriana = createDependency("Direction Régionale Ariana", ariana);
        createEtablissement("Lycée El Menzah 6", SchoolLevel.SECONDARY, drAriana);
        createEtablissement("Collège El Menzah 5", SchoolLevel.PREPARATORY, drAriana);
        createEtablissement("Ecole Primaire Ariana Centre", SchoolLevel.PRIMARY, drAriana);

        // Ben Arous
        Delegation benArous = createDelegation("Ben Arous");
        createDepartment("Inspection Ben Arous", benArous);
        Dependency drBenArous = createDependency("Direction Régionale Ben Arous", benArous);
        createEtablissement("Lycée Hammam Lif", SchoolLevel.SECONDARY, drBenArous);
        createEtablissement("Ecole Primaire Radès", SchoolLevel.PRIMARY, drBenArous);

        // Sousse
        Delegation sousse = createDelegation("Sousse 1");
        createDepartment("Inspection Sousse", sousse);
        Dependency drSousse = createDependency("Direction Régionale Sousse", sousse);
        createEtablissement("Lycée Pilote Sousse", SchoolLevel.SECONDARY, drSousse);

        log.info("Seeded Delegations, Departments and Schools.");
    }

    private Delegation createDelegation(String name) {
        return delegationRepository.save(Delegation.builder().name(name).build());
    }

    private void createDepartment(String name, Delegation delegation) {
        departmentRepository.save(Department.builder().name(name).delegation(delegation).build());
    }

    private Dependency createDependency(String name, Delegation delegation) {
        return dependencyRepository.save(Dependency.builder().name(name).delegation(delegation).build());
    }

    private void createEtablissement(String name, SchoolLevel level, Dependency dependency) {
        etablissementRepository.save(Etablissement.builder()
                .name(name)
                .schoolLevel(level)
                .dependency(dependency)
                .build());
    }

    private void seedUsers() {
        // Admin
        if (!userRepository.existsByEmail("admin@inspector.tn")) {
            userRepository.save(User.builder()
                    .email("admin@inspector.tn")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.ADMIN)
                    .serialCode("ADM001")
                    .profileCompleted(true)
                    .build());
        }

        // Inspector
        if (!userRepository.existsByEmail("moez.benali@inspector.tn")) {
            userRepository.save(User.builder()
                    .email("moez.benali@inspector.tn")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.INSPECTOR)
                    .serialCode("INS123")
                    .profileCompleted(false)
                    .build());
        }

        // Teacher
        if (!userRepository.existsByEmail("samia.nasri@teacher.tn")) {
            userRepository.save(User.builder()
                    .email("samia.nasri@teacher.tn")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.TEACHER)
                    .serialCode("TEA456")
                    .profileCompleted(false)
                    .build());
        }

        log.info("Seeded Test Users.");
    }
}
