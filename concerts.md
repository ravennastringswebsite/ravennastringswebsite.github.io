---
layout: default
title: Concerts & Schedules
---

# Concerts & Schedules

## Upcoming Concerts

{% assign upcoming_concerts = site.concerts | where_exp: "concert", "concert.date >= site.time" | sort: "date" %}
{% if upcoming_concerts.size > 0 %}
    {% for concert in upcoming_concerts %}
        <div class="concert-item">
            <h3><a href="{{ concert.url | relative_url }}">{{ concert.title }}</a></h3>
            <p class="concert-date">{{ concert.date | date: "%B %d, %Y" }} at {{ concert.time }}</p>
            <p><strong>Location:</strong> {{ concert.location }}</p>
            <p><strong>Address:</strong> {{ concert.address }}</p>
            <a href="{{ concert.url | relative_url }}" class="concert-link">View Details</a>
        </div>
    {% endfor %}
{% else %}
    <p>No upcoming concerts scheduled at this time. Please check back soon!</p>
{% endif %}

## Past Concerts

{% assign past_concerts = site.concerts | where_exp: "concert", "concert.date < site.time" | sort: "date" | reverse %}
{% if past_concerts.size > 0 %}
    {% for concert in past_concerts %}
        <div class="concert-item past">
            <h3><a href="{{ concert.url | relative_url }}">{{ concert.title }}</a></h3>
            <p class="concert-date">{{ concert.date | date: "%B %d, %Y" }} at {{ concert.time }}</p>
            <p><strong>Location:</strong> {{ concert.location }}</p>
            <a href="{{ concert.url | relative_url }}" class="concert-link">View Details</a>
        </div>
    {% endfor %}
{% endif %}

## Rehearsal Schedule

### The Ravenna Strings (Thursday Group)
- **Time:** 7:00 PM - 8:15 PM
- **Location:** Phinney Neighborhood Center
- **Address:** 6532 Phinney Ave. N, Seattle, WA 98103

### The Ravenna String Sinfonia (Monday Group)
- **Time:** 7:00 PM - 8:15 PM
- **Location:** Phinney Neighborhood Center
- **Address:** 6532 Phinney Ave. N, Seattle, WA 98103

## Join Us

Interested in performing with us? [Register now](/register) to join our orchestras!

## Contact

For more information about our concerts and schedules, please contact us at [ravennastrings@gmail.com](mailto:ravennastrings@gmail.com) 