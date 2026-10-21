# Cross-Dataset Generalization and Confidence Calibration of MobileNetV2 for Waste Classification

## About the Project

**WasteX** is a waste classification research project that investigates the cross-dataset generalization and confidence calibration of a MobileNetV2 deep learning model. The project evaluates a model trained on TrashNet and tested on RealWaste to study how well it performs on images from a different dataset.

The project also explores image transformations, model fine-tuning, and confidence calibration to understand the challenges of reliable waste classification in real-world conditions.

## Objectives

- Evaluate cross-dataset generalization from TrashNet to RealWaste.
- Investigate the effect of geometric and lighting transformations on classification performance.
- Improve performance through model fine-tuning.
- Examine confidence calibration using temperature scaling.
- Develop a software interface for waste classification.

## Methodology

1. Train a MobileNetV2-based classifier using the TrashNet dataset.
2. Evaluate its performance on the RealWaste dataset.
3. Experiment with geometric and lighting transformations.
4. Fine-tune the model and compare its performance with the baseline.
5. Investigate confidence calibration using temperature scaling.
6. Organize the model, supporting code, figures, and application components in the project repository.

## Experimental Results

The following results were obtained in the project's reported experiments:

| Experiment                | Accuracy |
| ------------------------- | -------: |
| Baseline model            |   45.66% |
| Geometric transformations |   46.61% |
| Lighting transformations  |   46.47% |
| Fine-tuned model          |   49.77% |

The fine-tuned model achieved a macro recall of **44.81%**.

These results indicate that cross-dataset waste classification remains challenging. Further improvements in generalization and class-wise performance are important for practical applications.

## Repository Structure

```text
WasteX/
├── backend/
├── final_figures/
├── waste-ai/src
├── website_working/
└── README.md
```

### Directory Overview

- **`backend/`** — Backend components for the application, depending on the included implementation.
- **`final_figures/`** — Figures and visualizations associated with the project and its experimental results.
- **`waste-ai/`src** — Waste classification application (Frontend) or AI-related project components.
- **`website_working/`** — Website Screenshots.

Refer to the files inside each directory for the exact implementation details and setup instructions.

## Technologies

The research and application may involve the following technologies, depending on the components included in this repository:

- Python
- TensorFlow / Keras
- MobileNetV2
- NumPy and Pandas
- Scikit-learn
- Matplotlib
- Flask
- React and Vite

## Datasets

The experiments use two datasets:

- **TrashNet:** Used as the training dataset.
- **RealWaste:** Used to evaluate cross-dataset generalization.

Please obtain datasets from their original sources and comply with their applicable terms of use. Dataset files are not necessarily included in this repository.

## Reproducibility

To reproduce the experiments:

1. Review the available training and evaluation notebooks or scripts.
2. Obtain the required datasets.
3. Install the dependencies specified by the project's dependency files, if provided.
4. Follow the training, evaluation, and calibration workflow documented in the source code.

Exact commands and package versions should be added after verifying the actual implementation.

## Future Work

- Improve generalization across different waste datasets.
- Investigate class-wise performance and difficult categories.
- Evaluate calibration on independent held-out data.
- Explore more robust training and data augmentation techniques.
- Improve the usability and deployment of the waste classification application.

## Disclaimer

WasteX is an academic research project. Its predictions and confidence scores should be evaluated carefully before use in real-world waste management systems.

## Author

**Divyanshi Kumari, Shreyashi Pandey**

Corresponding Author: Dr. Santosh Rajak

GitHub: [Divyanshi-kumari](https://github.com/Divyanshi-kumari)
