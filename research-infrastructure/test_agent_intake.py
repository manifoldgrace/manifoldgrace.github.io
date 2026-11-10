"""Offline test for read-only research intake."""
import pathlib
import tempfile
import unittest
from agent_intake import read_allowed, extract_claims

class IntakeTests(unittest.TestCase):
    def test_claim_extraction(self):
        with tempfile.TemporaryDirectory() as tmp:
            p=pathlib.Path(tmp)/"sample.md"
            p.write_text("# Sample\nCLAIM: A gateway calls a model\nCLAIM: Audit logs are recorded\n",encoding="utf-8")
            data,digest=read_allowed(p,pathlib.Path(tmp))
            record=extract_claims(data,"sample.md",digest)
            self.assertEqual(len(record["claims"]),2)
            self.assertEqual(record["claims"][0]["status"],"unverified")
            self.assertEqual(record["claims"][0]["sources"][0]["locator"],"line:2")
    def test_path_escape_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            outer=pathlib.Path(tmp)
            sub=outer/"allowed";sub.mkdir()
            p=outer/"outside.md";p.write_text("secret")
            with self.assertRaises(ValueError):read_allowed(p,sub)
if __name__=="__main__": unittest.main()
