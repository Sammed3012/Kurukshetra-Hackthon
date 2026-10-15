package com.soluper.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "solupers")
public class Soluper {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String role;
    private String category;
    private String status = "Active";
    private String roleGroup = "Member";
    
    @Column(length = 1000)
    private String image;

    @Column(length = 3000)
    private String bio;

    private String location;
    private String joined;
    private Integer commits = 0;
    private Integer projects = 0;

    private String githubUrl;
    private String linkedinUrl;
    private String twitterUrl;

    private String gradient;
    private Boolean featured = false;

    @Column(length = 4000)
    private String skillsJson;

    @Column(length = 4000)
    private String personalAchievementsJson;

    public Soluper() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRoleGroup() { return roleGroup; }
    public void setRoleGroup(String roleGroup) { this.roleGroup = roleGroup; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getJoined() { return joined; }
    public void setJoined(String joined) { this.joined = joined; }

    public Integer getCommits() { return commits; }
    public void setCommits(Integer commits) { this.commits = commits; }

    public Integer getProjects() { return projects; }
    public void setProjects(Integer projects) { this.projects = projects; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getTwitterUrl() { return twitterUrl; }
    public void setTwitterUrl(String twitterUrl) { this.twitterUrl = twitterUrl; }

    public String getGradient() { return gradient; }
    public void setGradient(String gradient) { this.gradient = gradient; }

    public Boolean getFeatured() { return featured; }
    public void setFeatured(Boolean featured) { this.featured = featured; }

    public String getSkillsJson() { return skillsJson; }
    public void setSkillsJson(String skillsJson) { this.skillsJson = skillsJson; }

    public String getPersonalAchievementsJson() { return personalAchievementsJson; }
    public void setPersonalAchievementsJson(String personalAchievementsJson) { this.personalAchievementsJson = personalAchievementsJson; }
}
