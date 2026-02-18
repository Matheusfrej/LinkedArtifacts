-- Script to populate db to test during development

INSERT INTO papers (id, title, doi, created_at) VALUES
(1, 'Probing New physics with high-redshift quasars: axions and non-standard cosmology', NULL, '2026-02-16 12:37:49.165206'),
(2, 'Some models are useful, but how do we know which ones? Towards a unified Bayesian model taxonomy', NULL, '2026-02-16 12:38:07.349173'),
(3, 'uravu: Making Bayesian modelling easy (er)', NULL, '2026-02-16 12:38:16.423765'),
(4, 'Overscreening and underscreening in solid-electrolyte grain boundary space-charge layers', NULL, '2026-02-16 12:38:27.16171'),
(5, 'PyAutoFit: A Classy Probabilistic Programming Language for Model Composition and Fitting', NULL, '2026-02-16 12:38:51.232754'),
(6, 'Bayes rules!: An introduction to applied Bayesian modeling', NULL, '2026-02-16 12:39:00.131728'),
(7, 'Learning Bayesian Models with R', NULL, '2026-02-16 12:39:09.81061');

INSERT INTO artifacts (id, name, url, paper_id, created_at, doi) VALUES
(1, 'Dataset', 'https://zenodo.org/record/123456', 1, '2026-02-16 12:43:36.611669', NULL),
(2, 'Code', 'https://github.com/dfm/corner.py', 1, '2026-02-16 12:44:00.335686', NULL),
(3, 'Forms', 'https://docs.google.com/forms/', 1, '2026-02-16 12:45:13.739562', NULL),
(4, 'Hello World', 'https://github.com/octocat/Hello-World', 2, '2026-02-16 12:45:28.799171', NULL),
(5, 'Code 2', 'https://github.com/tensorflow/tensorflow', 2, '2026-02-16 12:45:45.917115', NULL),
(6, 'Vue.js', 'https://github.com/vuejs/core', 3, '2026-02-16 12:45:59.054663', NULL),
(7, 'Dataset Kaggle', 'https://www.kaggle.com/datasets', 5, '2026-02-16 12:46:13.40904', NULL),
(8, 'Another Dataset', 'https://www.kaggle.com/datasets/uciml/iris', 5, '2026-02-16 12:46:32.369463', NULL),
(9, 'Dataset 3', 'https://archive.ics.uci.edu/', 7, '2026-02-16 12:46:54.135463', NULL);
