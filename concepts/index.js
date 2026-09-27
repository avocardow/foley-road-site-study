// Concept categories, each switched independently from the bar at the bottom of the model.
// A category lists options with an id, title, subtitle, stats, notes, and build(context) returning
// a THREE.Group. To add a category, create a file exporting its options and add an entry here;
// categories with no options are hidden.
import dogFence from "./dog-fence.js";
import homes from "./homes.js";

export default [
  { id: "fence", label: "Fence", options: dogFence },
  { id: "homes", label: "Homes", options: homes },
];
