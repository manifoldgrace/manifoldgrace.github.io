"""Illustrative synthetic test. No factual verification or independent annotations."""
import json
from pathlib import Path

def claim(value='active', scope='UK', date='2026-03-01', subject='service', predicate='status'):
    return dict(subject=subject, predicate=predicate, value=value, scope=scope, date=date)

def baseline(a, b):
    return 'same_value' if a['value'] == b['value'] else 'potential_contradiction'

def guarded(a, b):
    if a['subject'] != b['subject'] or a['predicate'] != b['predicate'] or a['scope'] != b['scope']:
        return 'distinct_scope'
    if not a['date'] or not b['date']:
        return 'insufficient_context'
    if a['date'] != b['date']:
        return 'different_observation_time'
    return baseline(a, b)

cases = [
 ('T01', claim(date='2026-01-01'), claim(value='paused'), 'different_observation_time'),
 ('T02', claim(), claim(value='paused'), 'potential_contradiction'),
 ('T03', claim(), claim(value='paused', scope='FR'), 'distinct_scope'),
 ('T04', claim(), claim(), 'same_value'),
 ('T05', claim(date=''), claim(value='paused'), 'insufficient_context'),
 ('T06', claim(), claim(subject='product'), 'distinct_scope'),
 ('T07', claim(), claim(date='2026-04-01'), 'different_observation_time'),
 ('T08', claim(date=''), claim(date=''), 'insufficient_context')
]
rows=[]
for case_id, a, b, expected in cases:
    base, new=baseline(a,b),guarded(a,b)
    assert new==expected, (case_id,new,expected)
    rows.append(dict(case_id=case_id,expected=expected,baseline=base,guarded=new,baseline_match=base==expected,guarded_match=new==expected))
result=dict(title='Scope and temporal guards: synthetic demonstration',date='2026-11-05',
 status='local synthetic demonstration; not independently validated',
 total_cases=len(rows),
 baseline_matches_authored_expectations=sum(x['baseline_match'] for x in rows),
 guarded_matches_authored_expectations=sum(x['guarded_match'] for x in rows),
 caveats=['Authored labels only','Not truth or credibility verification',
          'Different observation times need not imply both statements true',
          'No natural language extraction or generalisation'],results=rows)
Path('research-scope-time-guard-results-20261105.json').write_text(json.dumps(result,indent=2)+'\n')
print(result['baseline_matches_authored_expectations'],result['guarded_matches_authored_expectations'])
