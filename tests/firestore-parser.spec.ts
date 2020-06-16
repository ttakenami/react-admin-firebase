import {
  parseAllDocFromFirestore,
  recusivelyCheckObjectValue,
} from "../src/misc";
import { initFireWrapper } from "./integration-tests/utils/test-helpers";

describe("timestamp-parser tests", () => {
  test("retains number", () => {
    const doc = null;
    parseAllDocFromFirestore(doc);
    expect(doc).toBe(null);
  });

  test("retains falsey", () => {
    const doc = { a: null };
    parseAllDocFromFirestore(doc);
    expect(doc.a).toBe(null);
  });

  test("retains number", () => {
    const doc = { a: 1 };
    parseAllDocFromFirestore(doc);
    expect(doc.a).toBe(1);
  });

  test("retains string", () => {
    const doc = { a: "1" };
    parseAllDocFromFirestore(doc);
    expect(doc.a).toBe("1");
  });

  test("retains object", () => {
    const doc = { a: { f: "1" } };
    parseAllDocFromFirestore(doc);
    expect(doc.a.f).toBe("1");
  });

  test("converts timestamp simple", () => {
    const doc = { a: makeTimestamp() };
    parseAllDocFromFirestore(doc);
    expect(doc.a).toBeInstanceOf(Date);
  });

  test("converts timestamp deep nested", () => {
    const doc = { a: { b: makeTimestamp(), c: { d: makeTimestamp() } } };
    parseAllDocFromFirestore(doc);
    expect(doc.a.b).toBeInstanceOf(Date);
    expect(doc.a.c.d).toBeInstanceOf(Date);
  });

  test("converts timestamp array", () => {
    const doc = { a: { c: [makeTimestamp(), makeTimestamp()] } };
    parseAllDocFromFirestore(doc);
    expect(doc.a.c[0]).toBeInstanceOf(Date);
    expect(doc.a.c[1]).toBeInstanceOf(Date);
  });

  test("converts timestamp array", () => {
    const doc = { a: { c: [{ d: makeTimestamp() }] } };
    parseAllDocFromFirestore(doc);
    expect(doc.a.c[0].d).toBeInstanceOf(Date);
  });

  test("retains falsey", () => {
    const doc = ["okay"];
    recusivelyCheckObjectValue(doc);
    expect(doc[0]).toBe("okay");
  });

  test("check converts document references", () => {
    const doc = { ref: makeDocumentRef("something/here") };
    recusivelyCheckObjectValue(doc);
    expect(doc.ref["___refdocument"]).toBe("something/here");
  });
});

function makeTimestamp() {
  return new MockTimeStamp();
}

const fire = initFireWrapper("testId", { disableMeta: true });

function makeDocumentRef(path: string): firebase.firestore.DocumentReference {
  return fire.db().doc(path);
}

class MockTimeStamp {
  toDate() {
    return new Date();
  }
}
