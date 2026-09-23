/**
 * SERVICES — structure decision (client Q5: "design on your own with proper decisioning")
 *
 * Two sources disagreed:
 *   Minutes of Meeting  — services split into two streams: Exterior and Interior.
 *   Portfolio PDF       — six services listed flat: design consultancy, renovation
 *                         and staging, landscape, architecture planning, interior
 *                         design, turnkey projects.
 *
 * Decision: keep both, on different axes.
 *
 * The MoM's two-stream split is a *discipline* bifurcation and it is the right
 * brand-level structure — it is how a client thinks about what they need.
 * But two of the six items are not disciplines at all: "design consultancy" and
 * "turnkey projects" describe *how far we carry the work*, and both are
 * available across either discipline. Forcing them under Exterior or Interior
 * would misrepresent the offer.
 *
 * So: four disciplines under two streams, plus two engagement models that span
 * both. Nothing from either source is dropped, and the page answers the two
 * questions a prospective client actually has — what do you do, and how much of
 * it do you take on.
 */

export const STREAMS = [
  {
    id: 'exterior',
    number: '01',
    name: 'Exterior',
    summary:
      'The building and the ground it sits on — form, facade, and the approach to it.',
    services: [
      {
        name: 'Architecture Planning',
        body: 'Spatial planning, massing and facade development, from first sketch through to the drawing set a contractor can build from.',
        tags: ['Concept', 'Massing', 'Facade', 'Working drawings'],
      },
      {
        name: 'Landscape',
        body: 'The ground plane treated as part of the building — approach, levels, planting and the transition from outside to in.',
        tags: ['Site levels', 'Planting', 'Hardscape', 'Approach'],
      },
    ],
  },
  {
    id: 'interior',
    number: '02',
    name: 'Interior',
    summary:
      'Everything within the envelope — how a space is used, furnished and finished.',
    services: [
      {
        name: 'Interior Design',
        body: 'Layout, materiality, lighting and joinery detailing for residential and commercial interiors, resolved to a furniture-level plan.',
        tags: ['Layouts', 'Materiality', 'Lighting', 'Joinery'],
      },
      {
        name: 'Renovation & Staging',
        body: 'Working with what already stands — reconfiguring existing spaces, and presenting them to sell, let or hand over.',
        tags: ['Reconfiguration', 'Refurbishment', 'Styling', 'Handover'],
      },
    ],
  },
]

export const ENGAGEMENTS = [
  {
    name: 'Design Consultancy',
    body: 'Advisory engagement. We develop the design, the drawings and the specification; you appoint and run the contractors.',
    suits: 'Suits clients with an existing contractor or in-house project team.',
  },
  {
    name: 'Turnkey Projects',
    body: 'End-to-end delivery. Design, procurement, contractor coordination and site supervision through to a finished, styled handover.',
    suits: 'Suits clients who want a single point of accountability.',
  },
]
