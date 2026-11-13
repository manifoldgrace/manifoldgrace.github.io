"""Regression tests for dated public archive extraction and chronology."""
import datetime as dt
import tempfile
import unittest
from pathlib import Path
from scripts.build_publication_archive import extract_records, key_for

class PublicArchiveTests(unittest.TestCase):
    def parse(self,markup):
        with tempfile.TemporaryDirectory() as folder:
            p=Path(folder)/"log.html"
            p.write_text(markup,encoding="utf-8")
            return extract_records(p)
    def test_table_and_narrative_and_legacy_table_markup(self):
        markup=("""
        <article class="log-day" id="2026-11-10">
          <table class="progression-table"><thead><tr><th>Item</th></tr></thead>
            <tbody<tr id="table-one"><th>Published dated research summary</th>
            <td><a href="research.html">Research source</a></td></tr></tbody></table>
          <div class="log-entry" id="narrative-one">
            <h3>Educational retrospective</h3><p><a href="projects.html">Projects</a></p>
          </div>
        </article>""")
        records=self.parse(markup)
        self.assertEqual(len(records),2,records)
        self.assertEqual({r["record_id"] for r in records},{"table-one","narrative-one"})
        self.assertTrue(all(r["recorded_date"]=="2026-11-10" for r in records))
        self.assertTrue(all(r["original_publication_date"] is None for r in records))
    def test_dates_and_week_start(self):
        x={"recorded_date":"2026-11-08"}
        self.assertEqual(key_for(x,"daily"),"2026-11-08")
        self.assertEqual(key_for(x,"weekly"),"2026-11-02")
        self.assertEqual(key_for(x,"monthly"),"2026-11")
        self.assertEqual(key_for(x,"yearly"),"2026")
    def test_deduplicated_and_undated_excluded(self):
        markup=("""
        <article class="log-day" id="2026-11-09">
        <table class="progression-table"><tbody>
        <tr id="same"><th>Repeated public record</th></tr>
        <tr id="same"><th>Repeated public record</th></tr>
        </tbody></table></article>
        <section class="log-day" id="undated"><div class="log-entry">
        <h3>No date, must not be invented</h3></div></section>""")
        records=self.parse(markup)
        self.assertEqual(len(records),1)
        self.assertEqual(records[0]["recorded_date"],"2026-11-09")
    def test_no_third_party_article_body_is_stored(self):
        markup=("""
        <article class="log-day" id="2026-11-10">
        <div class="log-entry" id="owned"><h3>Original catalogue item</h3>
          <p>Sample long body text must not be copied to output.
          <a href="https://www.example.org/story">Cited external document</a></p>
        </div></article>""")
        records=self.parse(markup)
        self.assertEqual(len(records),1)
        self.assertNotIn("Sample long body",str(records))
        self.assertEqual(records[0]["evidence_url"],"https://www.example.org/story")

if __name__=="__main__":
    unittest.main()
