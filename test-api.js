const BASE_URL = "http://localhost:3000";

let passed = 0;
let failed = 0;

async function get(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  return response.json();
}

async function post(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, data: await response.text() };
}

function test(name, condition) {
  if (condition) {
    console.log(`PASSED: ${name}`);
    passed++;
  } else {
    console.log(`FAILED: ${name}`);
    failed++;
  }
}

async function runTests() {
  console.log("==========================================");
  console.log("API Test Suite");
  console.log("==========================================\n");

  try {
    console.log("Resetting data...");
    await post("/reset", {});
    console.log("");

    console.log("Test 1: search('ed')");
    const edResults = await get("/search?query=ed");
    console.log(JSON.stringify(edResults, null, 2));
    test("Eddy Verde is first with score 6", edResults[0]?.name === "Eddy Verde" && edResults[0]?.score === 6);
    test("Eddy Verde matches name and artists",
      edResults[0]?.matches?.includes("name") &&
      edResults[0]?.matches?.includes("artists")
    );
    test("Greta Heissenberger in results", edResults.some(r => r.name === "Greta Heissenberger"));
    console.log("");

    console.log("Test 2: search('the')");
    const theResults = await get("/search?query=the");
    console.log(JSON.stringify(theResults, null, 2));
    test("Jason Leo is first with score 3", theResults[0]?.name === "Jason Leo" && theResults[0]?.score === 3);
    test("Multiple movie matches only count once (Greta)",
      theResults.find(r => r.name === "Greta Heissenberger")?.score === 1
    );
    console.log("");

    console.log("Test 3: search('beethoven') before adding");
    const beethovenBefore = await get("/search?query=beethoven");
    console.log(JSON.stringify(beethovenBefore, null, 2));
    test("No results for beethoven initially", beethovenBefore.length === 0);
    console.log("");

    console.log("Test 4: Add Beethoven to Classical");
    const addResult = await post("/artists", { genre: "Classical", artist: "Beethoven" });
    test("Add artist returns 204", addResult.status === 204);
    console.log("");

    console.log("Test 5: search('beethoven') after adding");
    const beethovenAfter = await get("/search?query=beethoven");
    console.log(JSON.stringify(beethovenAfter, null, 2));
    test("Bonnie Wang found with score 2",
      beethovenAfter[0]?.name === "Bonnie Wang" && beethovenAfter[0]?.score === 2
    );
    test("Bonnie Wang matches artists", beethovenAfter[0]?.matches?.includes("artists"));
    console.log("");

    console.log("Test 6: Name matching");
    const eddyResults = await get("/search?query=eddy");
    test("Name match: 'eddy' finds Eddy Verde", eddyResults.some(r => r.name === "Eddy Verde"));
    console.log("");

    console.log("Test 7: Substring matching");
    const nniResults = await get("/search?query=nni");
    test("Substring: 'nni' matches 'Bonnie Wang'", nniResults.some(r => r.name === "Bonnie Wang"));
    console.log("");

    console.log("Test 8: Artist matching");
    const zeppelinResults = await get("/search?query=zeppelin");
    console.log(JSON.stringify(zeppelinResults, null, 2));
    test("Artist match: 'zeppelin' finds Rock fans", zeppelinResults.length > 0);
    console.log("");

    console.log("Test 9: Genre matching");
    const rockResults = await get("/search?query=rock");
    console.log(JSON.stringify(rockResults, null, 2));
    test("Genre match: 'rock' finds multiple people", rockResults.length >= 4);
    console.log("");

    console.log("Test 10: Movie matching");
    const avatarResults = await get("/search?query=avatar");
    test("Movie match: 'avatar' finds Eddy Verde", avatarResults.some(r => r.name === "Eddy Verde"));
    console.log("");

    console.log("Test 11: Location matching");
    const floridaResults = await get("/search?query=florida");
    test("Location match: 'florida' finds Eddy Verde", floridaResults.some(r => r.name === "Eddy Verde"));
    console.log("");

    console.log("Test 12: Case insensitivity");
    const upperResults = await get("/search?query=EDDY");
    const mixedResults = await get("/search?query=EdDy");
    test("Case insensitive: 'EDDY' works", upperResults.some(r => r.name === "Eddy Verde"));
    test("Case insensitive: 'EdDy' works", mixedResults.some(r => r.name === "Eddy Verde"));
    console.log("");

    console.log("Test 13: Empty query");
    const emptyResults = await get("/search?query=");
    test("Empty query returns empty array", emptyResults.length === 0);
    console.log("");

    console.log("Test 14: No results");
    const noResults = await get("/search?query=zzzzz");
    test("No results for 'zzzzz'", noResults.length === 0);
    console.log("");

    console.log("Test 15: Sorting by score DESC, then name ASC");
    const sortResults = await get("/search?query=rock");
    let isSorted = true;
    for (let i = 0; i < sortResults.length - 1; i++) {
      const curr = sortResults[i];
      const next = sortResults[i + 1];
      if (curr.score < next.score) {
        isSorted = false;
        break;
      }
      if (curr.score === next.score && curr.name > next.name) {
        isSorted = false;
        break;
      }
    }
    test("Results properly sorted", isSorted);
    console.log("");

    console.log("Test 16: API validation");
    const invalidPost1 = await post("/artists", { artist: "Test" });
    test("Invalid body: missing genre returns 400", invalidPost1.status === 400);

    const invalidPost2 = await post("/artists", { genre: "Rock" });
    test("Invalid body: missing artist returns 400", invalidPost2.status === 400);

    const invalidPost3 = await post("/artists", {});
    test("Invalid body: empty returns 400", invalidPost3.status === 400);
    console.log("");

    console.log("==========================================");
    console.log("Test Results Summary");
    console.log("==========================================");
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    console.log("");

    if (failed === 0) {
      console.log("All tests passed!");
      process.exit(0);
    } else {
      console.log("Some tests failed");
      process.exit(1);
    }

  } catch (error) {
    console.error("Error running tests:", error.message);
    console.error("\nMake sure the server is running: npm run dev");
    process.exit(1);
  }
}

runTests();
