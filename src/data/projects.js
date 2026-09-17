/**
 * PROJECTS
 *
 * ⚠ PLACEHOLDER DATA — NOT REAL WORK.
 *
 * The previous build shipped four invented projects (Elysian Spire, Solara
 * Pavilion, …) and rendered the *same* fabricated detail for every one of them
 * — "12,000 sq ft private residence, Dubai, UAE". On a live consultancy site
 * that reads as a misrepresentation of the practice's portfolio, so the
 * fabricated specifics have been removed entirely.
 *
 * What is left is layout scaffolding, explicitly flagged. The UI reads
 * `isPlaceholder` and marks the section so nobody — client or visitor —
 * mistakes it for real work.
 *
 * TO GO LIVE: replace this array with real projects (client Q11 deferred).
 * Per project we need: title, location, year, built area, type, photography,
 * and a short brief. Then set PROJECTS_ARE_PLACEHOLDER to false.
 */

export const PROJECTS_ARE_PLACEHOLDER = true

export const PROJECTS = [
  {
    slug: 'project-one',
    title: 'Project One',
    year: '——',
    type: 'Residential',
    location: null,
    area: null,
    brief: null,
    image: 'assets/project1.png',
    isPlaceholder: true,
  },
  {
    slug: 'project-two',
    title: 'Project Two',
    year: '——',
    type: 'Residential',
    location: null,
    area: null,
    brief: null,
    image: 'assets/project2.png',
    isPlaceholder: true,
  },
  {
    slug: 'project-three',
    title: 'Project Three',
    year: '——',
    type: 'Commercial',
    location: null,
    area: null,
    brief: null,
    image: 'assets/project3.png',
    isPlaceholder: true,
  },
  {
    slug: 'project-four',
    title: 'Project Four',
    year: '——',
    type: 'Interior',
    location: null,
    area: null,
    brief: null,
    image: 'assets/project4.png',
    isPlaceholder: true,
  },
]
