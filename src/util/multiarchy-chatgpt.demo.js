#! /usr/bin/env node

// https://chatgpt.com/c/671eb23b-6e00-8010-ae9e-05bbb1541cf9

import { createFamilyTree } from "./multiarchy-chatgpt.js";


// Sample data
const jsonOneChild = {
  persons: [
    { name: "Alice Johnson", father: "Tom Johnson", mother: "Mary Williams" },
    { name: "Bob Johnson", father: "Tom Johnson", mother: "Mary Williams" },
  ],
};

// Run the function
const familyTree = createFamilyTree(jsonOneChild);
console.log(familyTree);

// util % multiarchy-chatgpt.demo.js                                                             [add-graphviz-lit L|✚3…5]
// [
//   {
//     name: 'Tom Johnson',
//     children: [ [Object], [Object] ],
//     parents: []
//   },
//   {
//     name: 'Mary Williams',
//     children: [ [Object], [Object] ],
//     parents: []
//   }
// ]
