package com.soluper.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String tags; // Comma-separated: "React, Python, LLMs"
    private String icon = "Database";
    private String link;
    private String githubUrl;
    private String status = "Active";

    public Project() {}

    public Project(String title, String description, String tags, String icon) {
        this.title = title;
        this.description = description;
        this.tags = tags;
        this.icon = icon;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
