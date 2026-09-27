// Concept categories, each switched independently from the bar at the bottom of the model.
// A category lists options with an id, title, subtitle, stats, notes, and build(context) returning
// a THREE.Group. To add a category (house, landscaping, ...), create a file exporting its options
// and add an entry here; categories with no options are hidden.
import dogFence from "./dog-fence.js";
import stageOne from "./stage-one.js";
import stageTwo from "./stage-two.js";
import threeHomes from "./three-homes.js";

export default [
  { id: "fence", label: "Fence", options: dogFence },
  { id: "home", label: "Stage 1 · siblings", options: stageOne },
  { id: "friends", label: "Stage 2 · friends", options: stageTwo },
  { id: "three", label: "Three homes · one level", options: threeHomes },
];
