import { parseDocGetAllUploads } from "../src/misc";

describe("file-parser tests", () => {
  test("simple single file", () => {
    const doc = {
      name: "Some guy",
      file: makeFile(),
    };
    const result = parseDocGetAllUploads(doc);
    expect(result.uploads.length).toBe(1);
    expect(result.uploads[0].fieldDotsPath).toBe("file");
    expect(doc.file.rawFile).toBeFalsy();
  });

  test("simple files in array", () => {
    const doc = {
      name: "Some guy",
      files: [makeFile(), makeFile()],
    };
    const result = parseDocGetAllUploads(doc);
    expect(result.uploads.length).toBe(2);
    expect(result.uploads[0].fieldDotsPath).toBe("files.0");
    expect(doc.files[0].rawFile).toBeFalsy();
  });

  test("simple files in array objects", () => {
    const doc = {
      name: "Some guy",
      items: [
        {
          name: "albert",
          image: makeFile(),
        },
        {
          name: "franklin",
          image: makeFile(),
        },
      ],
    };
    const result = parseDocGetAllUploads(doc);
    expect(result.uploads.length).toBe(2);
    expect(result.uploads[0].fieldDotsPath).toBe("items.0.image");
    expect(result.uploads[0].fieldSlashesPath).toBe("items/0/image");
    expect(doc.items[0].image.rawFile).toBeFalsy();
  });

  test("test document references", () => {
    const doc = {
      name: "Some guy",
      items: [
        {
          ___refdocument: 'my/ref'
        },
      ],
    };
    const result = parseDocGetAllUploads(doc);
    expect(result.refdocs.length).toBe(1);
    expect(result.refdocs[0].fieldDotsPath).toBe("items.0");
    expect(result.refdocs[0].refPath).toBe("my/ref");
  });
});

function makeFile() {
  return new MockFile();
}

class MockFile {
  rawFile = "File binary goes here";
  src = "somethign";
}
