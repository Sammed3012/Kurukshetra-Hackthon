package com.soluper.backend.config;

import com.soluper.backend.model.*;
import com.soluper.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SoluperRepository soluperRepository;
    private final EventRepository eventRepository;
    private final ProjectRepository projectRepository;
    private final NoticeRepository noticeRepository;
    private final AchievementRepository achievementRepository;

    public DataInitializer(
            UserRepository userRepository,
            SoluperRepository soluperRepository,
            EventRepository eventRepository,
            ProjectRepository projectRepository,
            NoticeRepository noticeRepository,
            AchievementRepository achievementRepository
    ) {
        this.userRepository = userRepository;
        this.soluperRepository = soluperRepository;
        this.eventRepository = eventRepository;
        this.projectRepository = projectRepository;
        this.noticeRepository = noticeRepository;
        this.achievementRepository = achievementRepository;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedSolupers();
        seedEvents();
        seedProjects();
        seedNotices();
        seedAchievements();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            userRepository.save(new User("Chief Syndicate Admin", "admin@soluper.com", "admin123", "admin", "SOLUPER_CHIEF"));
            userRepository.save(new User("Soluper Vanguard", "member@soluper.com", "soluper123", "soluper", "SOLUPER_CORE"));
        }
    }

    private void seedSolupers() {
        if (soluperRepository.count() == 0) {
            Soluper s1 = new Soluper();
            s1.setName("Hariom Sandve");
            s1.setRole("Founder & Chief Executive Lead");
            s1.setCategory("Business & Strategy");
            s1.setStatus("Active");
            s1.setRoleGroup("Chief Lead");
            s1.setImage("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop");
            s1.setBio("Driving the strategic vision and operational excellence of the collective. Focusing on sustainable growth and partnerships.");
            s1.setLocation("Pune, India");
            s1.setJoined("March 2021");
            s1.setCommits(500);
            s1.setProjects(10);
            s1.setSkillsJson("[{\"name\":\"Strategy\",\"level\":90},{\"name\":\"Management\",\"level\":85},{\"name\":\"Operations\",\"level\":88},{\"name\":\"Growth\",\"level\":92}]");
            s1.setGithubUrl("https://github.com/hariomsandve");
            s1.setLinkedinUrl("#");
            s1.setTwitterUrl("#");
            s1.setGradient("from-amber-500 to-orange-600");
            s1.setFeatured(true);
            s1.setPersonalAchievementsJson("[{\"title\":\"Startup of the Year\",\"image\":\"https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=400&auto=format&fit=crop\",\"desc\":\"Recognized by Pune Innovation Hub.\"}]");
            soluperRepository.save(s1);

            Soluper s2 = new Soluper();
            s2.setName("Prem Gosawi");
            s2.setRole("Chief Technical Architect");
            s2.setCategory("Backend");
            s2.setStatus("Active");
            s2.setRoleGroup("Chief Lead");
            s2.setImage("https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=400&auto=format&fit=crop");
            s2.setBio("Designing robust APIs that can handle millions of requests. Optimizing queries and ensuring 99.99% uptime.");
            s2.setLocation("Google, Bangalore");
            s2.setJoined("July, 2024");
            s2.setCommits(3400);
            s2.setProjects(18);
            s2.setSkillsJson("[{\"name\":\"Go\",\"level\":92},{\"name\":\"PostgreSQL\",\"level\":95},{\"name\":\"Redis\",\"level\":85},{\"name\":\"Kafka\",\"level\":80}]");
            s2.setGithubUrl("https://github.com/premgosawi");
            s2.setLinkedinUrl("#");
            s2.setTwitterUrl("#");
            s2.setGradient("from-indigo-500 to-purple-600");
            s2.setFeatured(true);
            s2.setPersonalAchievementsJson("[{\"title\":\"Cloud Architect Cert\",\"image\":\"https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=400&auto=format&fit=crop\",\"desc\":\"Certified Solutions Architect Professional.\"}]");
            soluperRepository.save(s2);

            Soluper s3 = new Soluper();
            s3.setName("Sammed Chaugule");
            s3.setRole("President");
            s3.setCategory("Mobile");
            s3.setStatus("Active");
            s3.setRoleGroup("Lead");
            s3.setImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop");
            s3.setBio("Bringing the desktop experience to your pocket. Expert in cross-platform development for iOS and Android.");
            s3.setLocation("Meta, Bangalore");
            s3.setJoined("July 2025");
            s3.setCommits(650);
            s3.setProjects(9);
            s3.setSkillsJson("[{\"name\":\"Flutter\",\"level\":95},{\"name\":\"React Native\",\"level\":85},{\"name\":\"Swift\",\"level\":70},{\"name\":\"Firebase\",\"level\":90}]");
            s3.setGithubUrl("https://github.com/Sammed3012");
            s3.setLinkedinUrl("#");
            s3.setTwitterUrl("#");
            s3.setGradient("from-pink-500 to-rose-500");
            s3.setFeatured(true);
            s3.setPersonalAchievementsJson("[]");
            soluperRepository.save(s3);

            Soluper s4 = new Soluper();
            s4.setName("Sneha Jadhav");
            s4.setRole("President");
            s4.setCategory("Full Stack");
            s4.setStatus("Active");
            s4.setRoleGroup("Lead");
            s4.setImage("https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop");
            s4.setBio("Coordinating operations and leading strategic community initiatives globally.");
            s4.setLocation("Mumbai, India");
            s4.setJoined("August 2025");
            s4.setCommits(450);
            s4.setProjects(12);
            s4.setSkillsJson("[{\"name\":\"Leadership\",\"level\":95},{\"name\":\"Management\",\"level\":90},{\"name\":\"React\",\"level\":85},{\"name\":\"Node.js\",\"level\":80}]");
            s4.setGithubUrl("#");
            s4.setLinkedinUrl("#");
            s4.setTwitterUrl("#");
            s4.setGradient("from-cyan-500 to-blue-600");
            s4.setFeatured(true);
            s4.setPersonalAchievementsJson("[]");
            soluperRepository.save(s4);
        }
    }

    private void seedEvents() {
        if (eventRepository.count() == 0) {
            Event e1 = new Event();
            e1.setTitle("AI Innovation Summit 2025");
            e1.setDate("August 15, 2025");
            e1.setTime("10:00 AM - 4:00 PM IST");
            e1.setLocation("Virtual & Tech Hub, Bangalore");
            e1.setDescription("Join us for a full day of keynotes, panel discussions, and project showcases centering on next-gen agentic workflows and LLM engineering.");
            e1.setTag("Summit");
            e1.setImage("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop");
            e1.setStatus("Registration Open");
            e1.setCreatedBy("admin@soluper.com");
            eventRepository.save(e1);

            Event e2 = new Event();
            e2.setTitle("Vanguard Hackathon v2.0");
            e2.setDate("September 05-07, 2025");
            e2.setTime("48-Hour Coding Sprint");
            e2.setLocation("Online / Discord");
            e2.setDescription("Build innovative tools, themes, or integrations for the Solupers Ecosystem. $5,000 prize pool and mentoring from Chief Leads.");
            e2.setTag("Hackathon");
            e2.setImage("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop");
            e2.setStatus("Coming Soon");
            e2.setCreatedBy("admin@soluper.com");
            eventRepository.save(e2);

            Event e3 = new Event();
            e3.setTitle("Advanced System Design Workshop");
            e3.setDate("October 12, 2025");
            e3.setTime("2:00 PM - 6:00 PM IST");
            e3.setLocation("Google Meet");
            e3.setDescription("Deep-dive session on distributed databases, event-driven architectures, Kafka pipelines, and horizontal scaling strategies.");
            e3.setTag("Workshop");
            e3.setImage("https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop");
            e3.setStatus("Registration Open");
            e3.setCreatedBy("admin@soluper.com");
            eventRepository.save(e3);
        }
    }

    private void seedProjects() {
        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "Edu-Advisory",
                    "AI-driven educational counseling platform helping students choose the right career path.",
                    "React, Python, LLMs",
                    "Database"
            ));
            projectRepository.save(new Project(
                    "Digi-Traffic",
                    "Smart city traffic management system using IoT sensors and real-time computer vision.",
                    "Python, IoT, TensorFlow",
                    "Zap"
            ));
            projectRepository.save(new Project(
                    "DevForge CLI",
                    "A developer tool that scaffolds production-ready microservices in seconds.",
                    "Go, Rust, Docker",
                    "Terminal"
            ));
        }
    }

    private void seedNotices() {
        if (noticeRepository.count() == 0) {
            noticeRepository.save(new Notice(
                    "Urgent",
                    "Oct 24",
                    "Hackathon Registration Closing",
                    "Final call for the AI Innovation Summit. Teams must submit proposals by Friday.",
                    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=600&auto=format&fit=crop"
            ));
            noticeRepository.save(new Notice(
                    "System",
                    "Oct 22",
                    "v2.4 Deployment Successful",
                    "Performance optimizations are now live. API latency reduced by 40%. All clusters report normal health.",
                    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop"
            ));
            noticeRepository.save(new Notice(
                    "Event",
                    "Oct 20",
                    "Community Meetup",
                    "Join us this Friday at the Tech Hub for a deep dive session on Distributed Systems and Rust.",
                    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop"
            ));
        }
    }

    private void seedAchievements() {
        if (achievementRepository.count() == 0) {
            Achievement a = new Achievement();
            a.setTitle("Smart India Hackathon 2024 Winners");
            a.setDescription("Secured 1st Place in Smart Automation category for our real-time smart agriculture optimizer.");
            a.setDate("Dec 2024");
            a.setLocation("New Delhi, India");
            a.setBadge("🏆 1st Place");
            a.setCover("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop");
            a.setPhotosJson("[\"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop\"]");
            a.setSizeClass("md:col-span-2 md:row-span-2");
            a.setIcon("trophy");
            a.setCreatedBy("admin@soluper.com");
            achievementRepository.save(a);
        }
    }
}
