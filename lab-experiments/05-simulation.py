"""05. Reproducible, small scientific-simulation example.
A logistic population model for teaching, NOT a validated empirical prediction.
"""
import random
import statistics
RNG = random.Random(43)

def simulate(growth=0.28, capacity=300, steps=20, start=80):
    n = float(start)
    series = [round(n, 2)]
    for _ in range(steps):
        noise = RNG.gauss(0, 2)  # documented stochastic assumption
        n = max(0, n + growth*n*(1-n/capacity) + noise)
        series.append(round(n, 2))
    return series

LOW = simulate(growth=0.12)
HIGH = simulate(growth=0.34)
print("Year | Low growth | High growth")
for t, (lo, hi) in enumerate(zip(LOW, HIGH)):
    print(f"{t:>4} | {lo:>10.2f} | {hi:>11.2f}")
print("Mean final value:", round(statistics.mean((LOW[-1], HIGH[-1])), 2))
print("Interpretation depends on evidence for model assumptions and parameters.")
