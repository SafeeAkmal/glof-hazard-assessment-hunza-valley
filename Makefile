.PHONY: export-data preprocess label pretrain train-baseline train-fusion evaluate timeseries hazard test reproduce-all

LAKE ?= shishper

export-data:
	@echo "[export-data] not implemented yet (Epic 1) — LAKE=$(LAKE)"

preprocess:
	@echo "[preprocess] not implemented yet (Epic 2) — LAKE=$(LAKE)"

label:
	@echo "[label] not implemented yet (Epic 4) — LAKE=$(LAKE)"

pretrain:
	@echo "[pretrain] not implemented yet (Epic 3)"

train-baseline:
	@echo "[train-baseline] not implemented yet (Epic 5)"

train-fusion:
	@echo "[train-fusion] not implemented yet (Epic 6)"

evaluate:
	@echo "[evaluate] not implemented yet (Epic 7)"

timeseries:
	@echo "[timeseries] not implemented yet (Epic 8) — LAKE=$(LAKE)"

hazard:
	@echo "[hazard] not implemented yet (Epic 9) — LAKE=$(LAKE)"

test:
	pytest tests/ -v

reproduce-all: export-data preprocess label pretrain train-baseline train-fusion evaluate timeseries hazard
	@echo "[reproduce-all] stub chain complete for LAKE=$(LAKE) — targets above are not yet implemented"
